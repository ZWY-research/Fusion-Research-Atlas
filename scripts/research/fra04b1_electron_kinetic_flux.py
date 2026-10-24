"""FRA-04B1: prescribed dimensionless reduced kinetic resonance model.

Requires Python, NumPy, SciPy and Matplotlib. Run with --output-dir PATH to
regenerate every numerical artifact and figure. No experimental data, fitting,
network access or reference-answer constants enter the calculation. Failed
numerical checks raise an exception. Logs/caches belong outside the repository.
"""

import argparse
import csv
from dataclasses import asdict, dataclass, replace
import hashlib
import json
from pathlib import Path
import platform
import warnings

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import scipy
from scipy.integrate import IntegrationWarning, quad
from scipy.linalg import eigh_tridiagonal
from scipy.optimize import brentq
from scipy.special import gamma as gamma_function, roots_genlaguerre


@dataclass(frozen=True)
class Parameters:
    g_n: float = 2.0
    g_e: float = 4.0
    c_star: float = -0.1
    c_d: float = 0.5
    f_t: float = 0.4
    gamma: float = 0.15
    nu: float = 0.05


BASE = Parameters()
ORDERS = (40, 80, 160, 240, 320, 640, 1280, 2560)
STEPS = (1e-3, 1e-4)
SCAN = np.linspace(0.2, 1.6, 81)
QUAD_TOL = 2e-12
ROOT_TOL = 5e-14


def weight(u):
    return 2 / np.sqrt(np.pi) * np.sqrt(u) * np.exp(-u)


def kernels(u, omega_r, p=BASE):
    """Unweighted complex response and its fixed-mode g_e derivative."""
    omega = complex(omega_r, p.gamma)
    denominator = omega - p.c_d * u + 1j * p.nu
    drive = p.c_star * (p.g_n + (u - 1.5) * p.g_e)
    return (
        -p.f_t * (omega - drive) / denominator,
        p.f_t * p.c_star * (u - 1.5) / denominator,
    )


def laguerre_rule(order):
    if order <= 320:
        nodes, weights = roots_genlaguerre(order, 0.5)
        weights = weights / gamma_function(1.5)
        method = "scipy.special.roots_genlaguerre / Gamma(3/2)"
    else:
        # Golub-Welsch for the SAME alpha=1/2 rule, avoiding polynomial overflow.
        # The squared first eigenvector components already sum to one; raw
        # Laguerre weights would be Gamma(3/2) times these components.
        j = np.arange(order, dtype=float)
        k = np.arange(1, order, dtype=float)
        nodes, vectors = eigh_tridiagonal(2 * j + 1.5, np.sqrt(k * (k + 0.5)))
        weights = vectors[0] ** 2
        method = "normalized Golub-Welsch, scipy.linalg.eigh_tridiagonal"
    if not (np.all(np.isfinite(nodes)) and np.all(np.isfinite(weights))):
        raise ArithmeticError(f"Nonfinite Gauss-Laguerre rule at N={order}")
    if not (np.all(nodes > 0) and np.all(weights >= 0)):
        raise ArithmeticError(f"Invalid Gauss-Laguerre rule at N={order}")
    return nodes, weights, method


def gl_response(omega_r, rule, p=BASE):
    chi, derivative = kernels(rule[0], omega_r, p)
    return complex(rule[1] @ chi), complex(rule[1] @ derivative)


def integrate_real(function, lo=0, hi=np.inf, tol=QUAD_TOL):
    value, error = quad(function, lo, hi, epsabs=tol, epsrel=tol, limit=400)
    if not (np.isfinite(value) and np.isfinite(error)):
        raise ArithmeticError("Nonfinite adaptive integral")
    return float(value), float(error)


def quad_response(omega_r, p=BASE, tol=QUAD_TOL):
    values, errors = [], []
    for index in (0, 1):
        real, err_real = integrate_real(
            lambda u: float(weight(u) * kernels(u, omega_r, p)[index].real), tol=tol
        )
        imag, err_imag = integrate_real(
            lambda u: float(weight(u) * kernels(u, omega_r, p)[index].imag), tol=tol
        )
        values.append(complex(real, imag))
        errors.append([err_real, err_imag])
    return values[0], values[1], errors


def roots_in_scan(function):
    values = [function(float(x)) for x in SCAN]
    roots = []
    for a, b, fa, fb in zip(SCAN[:-1], SCAN[1:], values[:-1], values[1:]):
        if fa == 0:
            roots.append(float(a))
        elif fa * fb < 0:
            roots.append(float(brentq(function, a, b, xtol=ROOT_TOL)))
    if values[-1] == 0:
        roots.append(float(SCAN[-1]))
    return roots


def write_csv(path, rows):
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def write_json(path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8")


def energy_data():
    integrated, densities = [], []
    for omega_r in (0.4, 1.2):
        eta = BASE.gamma + BASE.nu
        # Independent real algebra of -Im(chi integrand), including w(u).
        a = -BASE.nu * omega_r + eta * BASE.c_star * (BASE.g_n - 1.5 * BASE.g_e)
        b = eta * BASE.c_star * BASE.g_e - BASE.gamma * BASE.c_d

        def f(u):
            return BASE.f_t * weight(u) * (a + b * u) / ((omega_r - BASE.c_d * u) ** 2 + eta ** 2)

        def s(u):
            return BASE.f_t * BASE.c_star * eta * weight(u) * (u - 1.5) / ((omega_r - BASE.c_d * u) ** 2 + eta ** 2)

        # Both densities have one sign change for these declared parameters.
        f_zero = -a / b
        assert f_zero > 0 and b < 0 and BASE.c_star < 0
        f_positive = integrate_real(f, 0, f_zero)[0]
        f_negative = integrate_real(f, f_zero)[0]
        s_positive = integrate_real(s, 0, 1.5)[0]
        s_negative = integrate_real(s, 1.5)[0]
        chi, derivative, _ = quad_response(omega_r)
        integrated.append({
            "omega_r": omega_r, "u_res": omega_r / BASE.c_d,
            "f_sign_change_u": f_zero,
            "F_positive": f_positive, "F_negative": f_negative,
            "F_sum": f_positive + f_negative,
            "F_reconstruction_error": abs(f_positive + f_negative + chi.imag),
            "S_u_below_1_5_positive": s_positive,
            "S_u_above_1_5_negative": s_negative,
            "S_sum": s_positive + s_negative,
            "S_reconstruction_error": abs(s_positive + s_negative + derivative.imag),
            "F_tail_above_24": integrate_real(f, 24)[0],
            "S_tail_above_24": integrate_real(s, 24)[0],
        })
        for u in np.linspace(0, 24, 1601):
            densities.append({"omega_r": omega_r, "u": float(u), "f_u": float(f(u)), "s_u": float(s(u))})
    return integrated, densities


def figures(output, scan_rows, densities, root):
    plt.rcParams.update({"font.size": 10, "svg.fonttype": "none", "svg.hashsalt": "fra04b1"})
    subtitle = (
        "Reduced kinetic resonance model | dimensionless parameters\n"
        r"Fixed mode in $\partial/\partial g_e$: $g_n=2$, $g_e=4$, $\gamma=0.15$, $\nu=0.05$"
        "\n"
        r"$c_*=-0.1$, $c_d=0.5$, $f_t=0.4$ | prescribed calculation, not experimental data"
    )

    def save(fig, name):
        fig.suptitle(subtitle, fontsize=9)
        fig.tight_layout(rect=(0, 0, 1, 0.98))
        path = output / name
        fig.savefig(path, metadata={"Date": None, "Creator": "FRA-04B1 calculation"})
        # Matplotlib emits trailing spaces inside SVG path attributes. Newlines
        # remain valid separators after stripping them; keep git diff --check clean.
        path.write_text("\n".join(line.rstrip() for line in path.read_text(encoding="utf-8").splitlines()) + "\n", encoding="utf-8")
        plt.close(fig)

    x = [row["omega_r"] for row in scan_rows]
    fig, ax = plt.subplots(figsize=(7.4, 4.9))
    ax.plot(x, [row["F_e"] for row in scan_rows], label="N=2560 Gauss-Laguerre")
    ax.axhline(0, color="gray", linewidth=0.8)
    ax.set(xlabel=r"$\omega_r$", ylabel=r"$F_e=-\mathrm{Im}\,\chi_e$ (normalized signed flux)")
    ax.text(0.32, 0.85, r"$F_e<0$: inward for the stated $k_y>0$ convention", transform=ax.transAxes)
    ax.legend()
    save(fig, "flux-vs-omega.svg")

    fig, ax = plt.subplots(figsize=(7.4, 4.9))
    ax.plot(x, [row["S_e_analytic"] for row in scan_rows], label="Integrated analytic derivative")
    ax.axhline(0, color="gray", linewidth=0.8)
    ax.axvline(root, color="tab:red", linestyle="--", linewidth=1)
    ax.scatter([root], [0], color="tab:red", zorder=3)
    ax.annotate(f"S zero: {root:.8f}\nNot an F zero", (root, 0), xytext=(1.0, 0.035), arrowprops={"arrowstyle": "->"})
    ax.set(xlabel=r"$\omega_r$", ylabel=r"$S_e=\partial F_e/\partial g_e$ (normalized signed flux response)")
    ax.legend(loc="upper right")
    save(fig, "gradient-response-vs-omega.svg")

    fig, ax = plt.subplots(figsize=(7.4, 4.9))
    for omega_r, color in ((0.4, "tab:blue"), (1.2, "tab:orange")):
        rows = [row for row in densities if row["omega_r"] == omega_r]
        ax.plot([row["u"] for row in rows], [row["s_u"] for row in rows], color=color, label=fr"$\omega_r={omega_r}$")
        ax.axvline(omega_r / BASE.c_d, color=color, linestyle=":", label=fr"$u_{{res}}={omega_r / BASE.c_d:g}$")
    ax.axhline(0, color="gray", linewidth=0.8)
    ax.axvline(1.5, color="black", linestyle="--", linewidth=1, label=r"$u=3/2$")
    ax.set(xlim=(0, 8), xlabel=r"$u=E/T_e$", ylabel=r"$s(u)$ (normalized signed flux response per unit $u$)")
    ax.legend()
    save(fig, "energy-contributions.svg")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    output = args.output_dir
    output.mkdir(parents=True, exist_ok=True)
    warnings.simplefilter("error", IntegrationWarning)
    checks = {}

    def check(name, condition):
        checks[name] = bool(condition)
        if not condition:
            raise AssertionError(name)

    qscan = [quad_response(float(r)) for r in SCAN]
    qroots = roots_in_scan(lambda r: -quad_response(r)[1].imag)
    check("V7_one_bracketed_adaptive_S_root", len(qroots) == 1)
    qroot = qroots[0]
    convergence, rules = [], {}
    previous_root = None
    for order in ORDERS:
        rule = laguerre_rule(order)
        rules[order] = rule
        values = [gl_response(float(r), rule) for r in SCAN]
        roots = roots_in_scan(lambda r: -gl_response(r, rule)[1].imag)
        check(f"V1_N{order}_normalization", abs(float(sum(rule[1])) - 1) < 1e-12)
        check(f"V6_N{order}_finite", bool(np.all(np.isfinite(values))))
        check(f"V7_N{order}_one_bracketed_S_root", len(roots) == 1)
        root = roots[0]
        convergence.append({
            "order": order, "method": rule[2],
            "weight_sum_error": abs(float(sum(rule[1])) - 1),
            "max_abs_chi_error_vs_quad": max(abs(v[0] - q[0]) for v, q in zip(values, qscan)),
            "max_abs_F_error_vs_quad": max(abs(v[0].imag - q[0].imag) for v, q in zip(values, qscan)),
            "max_abs_S_error_vs_quad": max(abs(v[1].imag - q[1].imag) for v, q in zip(values, qscan)),
            "S_root": root, "S_root_shift_vs_quad": root - qroot,
            "S_root_shift_vs_previous_order": "" if previous_root is None else root - previous_root,
            "S_root_count_bracketed": len(roots),
        })
        previous_root = root
    final = rules[ORDERS[-1]]
    check("V6_final_max_complex_chi_error_below_2e_9", convergence[-1]["max_abs_chi_error_vs_quad"] < 2e-9)
    check("V6_final_max_S_error_below_2e_10", convergence[-1]["max_abs_S_error_vs_quad"] < 2e-10)
    check("V6_final_S_root_error_below_1e_9", abs(convergence[-1]["S_root_shift_vs_quad"]) < 1e-9)

    scan_rows = []
    for r, (qchi, qder, _) in zip(SCAN, qscan):
        chi, derivative = gl_response(float(r), final)
        row = {"omega_r": float(r), "chi_real": chi.real, "chi_imag": chi.imag,
               "F_e": -chi.imag, "S_e_analytic": -derivative.imag,
               "quad_chi_real": qchi.real, "quad_chi_imag": qchi.imag,
               "quad_F_e": -qchi.imag, "quad_S_e": -qder.imag}
        for h in STEPS:
            fd = -(gl_response(float(r), final, replace(BASE, g_e=BASE.g_e + h))[0].imag
                   - gl_response(float(r), final, replace(BASE, g_e=BASE.g_e - h))[0].imag) / (2 * h)
            row[f"S_e_fd_h{h:g}"] = fd
            row[f"abs_S_fd_error_h{h:g}"] = abs(fd + derivative.imag)
        scan_rows.append(row)
    fd_errors = {f"{h:g}": max(row[f"abs_S_fd_error_h{h:g}"] for row in scan_rows) for h in STEPS}
    check("V4_both_FD_steps_all_81_frequencies", max(fd_errors.values()) < 2e-10)
    normalization, normalization_error = integrate_real(weight)
    check("V1_quad_normalization", abs(normalization - 1) < 1e-12)
    for r in (0.2, 0.8, 1.6):
        zero = gl_response(r, final, replace(BASE, f_t=0))
        check(f"V2_zero_participation_{r}", zero == (0j, 0j))
        real = gl_response(r, final, replace(BASE, c_d=0, nu=0, gamma=0))
        check(f"V3_real_kernel_{r}", abs(real[0].imag) < 1e-14 and abs(real[1].imag) < 1e-14)
    check("V5_no_ion_gradient_in_parameter_schema", "g_i" not in asdict(BASE))
    root_chi, root_derivative, _ = quad_response(qroot)
    root_tight = brentq(lambda r: -quad_response(r, tol=2e-13)[1].imag, 0.8, 0.86, xtol=ROOT_TOL)
    sides = [-quad_response(qroot + offset)[1].imag for offset in (-1e-4, 1e-4)]
    check("V7_S_positive_left_negative_right_and_F_negative", sides[0] > 0 > sides[1] and root_chi.imag > 0)
    check("V7_tighter_quad_root_stability", abs(root_tight - qroot) < 1e-10)
    check("V7_F_negative_at_all_scan_points", all(row["F_e"] < 0 for row in scan_rows))
    integrated, densities = energy_data()
    check("energy_density_reconstructs_complex_integrals", max(max(row["F_reconstruction_error"], row["S_reconstruction_error"]) for row in integrated) < 1e-11)

    representatives = []
    for r in (0.2, 0.4, 1.0, 1.2, 1.6):
        chi, der = gl_response(r, final)
        qchi, qder, _ = quad_response(r)
        representatives.append({"omega_r": r, "chi_real": chi.real, "chi_imag": chi.imag,
                                "F_e": -chi.imag, "S_e": -der.imag,
                                "abs_chi_error_vs_quad": abs(chi - qchi), "abs_S_error_vs_quad": abs(der.imag - qder.imag)})
    script_hash = hashlib.sha256(Path(__file__).read_text(encoding="utf-8").replace("\r\n", "\n").encode()).hexdigest()
    metadata = {
        "model": "reduced kinetic resonance model; prescribed, not gyrokinetic or experimental",
        "parameters": asdict(BASE), "all_parameters_dimensionless": True,
        "scan": {"start": 0.2, "stop": 1.6, "points": 81},
        "quadrature": {"alpha": 0.5, "orders": list(ORDERS), "published_scan_order": ORDERS[-1],
                       "quad_epsabs_epsrel": QUAD_TOL, "quad_limit": 400, "brentq_xtol": ROOT_TOL},
        "finite_difference_steps": list(STEPS),
        "energy_density_grid": {"start": 0, "stop": 24, "points_per_frequency": 1601,
                                "integrals": "adaptive on [0,infinity); plot displays [0,8]"},
        "environment": {"python": platform.python_version(), "numpy": np.__version__,
                        "scipy": scipy.__version__, "matplotlib": matplotlib.__version__,
                        "floating_point": "float64/complex128"},
        "script_sha256_lf": script_hash,
    }
    summary = {
        "representatives": representatives,
        "S_zero": {"quad": qroot, "quad_tight": root_tight, "gauss_laguerre": convergence[-1]["S_root"],
                   "chi_real": root_chi.real, "chi_imag": root_chi.imag,
                   "F_e": -root_chi.imag, "S_residual": -root_derivative.imag,
                   "offset_for_side_test": 1e-4, "S_left": sides[0], "S_right": sides[1],
                   "reported_root_digits": "0.83286795; numerical agreement, not physical uncertainty"},
        "scan_F_range": [min(row["F_e"] for row in scan_rows), max(row["F_e"] for row in scan_rows)],
        "max_FD_absolute_errors": fd_errors,
        "max_quad_reported_component_error_estimate": max(max(pair) for q in qscan for pair in q[2]),
        "quad_normalization": normalization, "quad_normalization_error_estimate": normalization_error,
        "energy_contributions": integrated, "convergence": convergence,
        "g_i_result": "No g_i input: partial F_e / partial g_i = 0 at fixed mode by construction, not an ITG law.",
        "root_search_scope": "Sign-change brackets on 81 points; does not prove absence of unsampled/tangential roots.",
        "verification_scope": "Numerical implementation checks only; no independent physical validation.",
        "checks": checks, "all_checks_pass": all(checks.values()),
    }
    write_json(output / "parameters.json", metadata)
    write_json(output / "checks.json", summary)
    write_csv(output / "scan.csv", scan_rows)
    write_csv(output / "convergence.csv", convergence)
    write_csv(output / "energy-contributions.csv", integrated)
    write_csv(output / "energy-densities.csv", densities)
    figures(output, scan_rows, densities, qroot)
    print(json.dumps({"environment": metadata["environment"], "representatives": representatives,
                      "S_zero": summary["S_zero"], "max_FD_errors": fd_errors,
                      "final_convergence": convergence[-1], "checks_passed": len(checks)}, indent=2))


if __name__ == "__main__":
    main()
