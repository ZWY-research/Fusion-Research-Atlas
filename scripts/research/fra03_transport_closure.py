"""FRA-03: prescribed dimensionless closure examples, not experimental inference.

Requires an installed Python with NumPy. All inputs are declared below; no network,
random sampling, parameter fitting or proprietary data is used. Output goes only
to the explicitly supplied directory. A failed numerical check exits nonzero.
"""

import argparse
import csv
import hashlib
import json
import math
import platform
from pathlib import Path

import numpy as np


PARAMETERS = {
    "c1": {"points": 129, "D": [0.5, 1.2], "n_offset": 1.0, "n_amplitude": 0.2},
    "c2": {"r": 0.5, "D_tan": 0.7, "V_tan": -0.3},
    "c3": {
        "length": math.pi,
        "D": 1.0,
        "lambdas": [0.0, 0.5, -0.5],
        "epsilons": [0.025, 0.05, 0.1],
        "target_time": 0.2,
        "intervals": [64, 128, 256],
        "diffusive_step_factors": [0.2, 0.1],
        "boundary_u": [0.0, 0.0],
    },
}


def write_csv(path, rows):
    with path.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def steady_example():
    c = PARAMETERS["c1"]
    r = np.linspace(0.0, 1.0, c["points"])
    n = c["n_offset"] + c["n_amplitude"] * np.cos(np.pi * r)
    gradient = -c["n_amplitude"] * np.pi * np.sin(np.pi * r)
    velocities = [d * gradient / n for d in c["D"]]
    residuals = [-d * gradient + v * n for d, v in zip(c["D"], velocities)]
    rows = [
        {
            "r": float(r[i]), "n0": float(n[i]), "n0_prime": float(gradient[i]),
            "D1": c["D"][0], "V1": float(velocities[0][i]),
            "flux_residual_1": float(residuals[0][i]),
            "D2": c["D"][1], "V2": float(velocities[1][i]),
            "flux_residual_2": float(residuals[1][i]),
        }
        for i in range(len(r))
    ]
    summary = {
        "density_min": float(n.min()),
        "max_flux_residual": [float(np.max(np.abs(x))) for x in residuals],
        "velocity_min_sampled": [float(x.min()) for x in velocities],
        "velocity_max_sampled": [float(x.max()) for x in velocities],
        "velocity_at_r_half": [float(x[len(r) // 2]) for x in velocities],
        "interpretation": "Constructed mathematical profiles; not experimental inversion.",
    }
    return summary, rows


def tangent_example():
    c = PARAMETERS["c2"]
    # Exact trigonometric values at r=1/2, avoiding cos(pi/2) roundoff.
    independent = np.array([[0.0, 1.0], [2.0 * np.pi, 0.0]])
    dependent = np.array([[0.0, 1.0], [0.0, 2.0]])
    specified = np.array([c["D_tan"], c["V_tan"]])
    flux = independent @ specified
    recovered = np.linalg.solve(independent, flux)
    dependent_flux = dependent @ specified
    candidates = [np.array([d, c["V_tan"]]) for d in [0.7, 1.2]]
    return {
        "column_order": ["D_tan", "V_tan"],
        "independent": {
            "matrix": independent.tolist(), "flux": flux.tolist(),
            "inverse": np.linalg.inv(independent).tolist(),
            "rank": int(np.linalg.matrix_rank(independent)),
            "determinant": float(np.linalg.det(independent)),
            "condition_number_2": float(np.linalg.cond(independent)),
            "specified": specified.tolist(), "recovered": recovered.tolist(),
            "coefficient_error_max": float(np.max(np.abs(recovered - specified))),
            "flux_residual_max": float(np.max(np.abs(independent @ recovered - flux))),
        },
        "dependent": {
            "matrix": dependent.tolist(), "flux": dependent_flux.tolist(),
            "rank": int(np.linalg.matrix_rank(dependent)),
            "condition_number_2": None,
            "condition_number_note": "infinite: rank deficient; null is the JSON representation",
            "null_direction": [1.0, 0.0],
            "distinct_positive_D_candidates": [x.tolist() for x in candidates],
            "candidate_residual_max": [
                float(np.max(np.abs(dependent @ x - dependent_flux))) for x in candidates
            ],
            "interpretation": "No unique recovery of both coefficients is possible.",
        },
    }


def integrate(intervals, step_factor, cases):
    """Centered conservative face flux, classical RK4, fixed endpoint values.

    Face flux: -D*(u[i+1]-u[i])/h + lambda*(u[i+1]^2+u[i]^2)/2.
    Its negative divergence gives the centered diffusion and quadratic-flux
    differences below. Boundary degrees of freedom have exactly zero RHS at
    every RK stage, not a periodic wrap or a post-step-only boundary correction.
    """
    c = PARAMETERS["c3"]
    x = np.linspace(0.0, c["length"], intervals + 1)
    h = c["length"] / intervals
    steps = math.ceil(c["target_time"] / (step_factor * h * h / c["D"]))
    dt = c["target_time"] / steps
    lam = np.array([case[0] for case in cases])[:, None]
    eps = np.array([case[1] for case in cases])[:, None]
    u = eps * np.sin(x)[None, :]
    u[:, [0, -1]] = 0.0
    initial_max = float(u.max())

    def rhs(state):
        result = np.zeros_like(state)
        result[:, 1:-1] = (
            c["D"] * (state[:, 2:] - 2.0 * state[:, 1:-1] + state[:, :-2]) / h**2
            - lam * (state[:, 2:]**2 - state[:, :-2]**2) / (2.0 * h)
        )
        return result

    min_u = float(u.min())
    max_u = initial_max
    max_boundary_error = 0.0
    for _ in range(steps):
        k1 = rhs(u)
        k2 = rhs(u + 0.5 * dt * k1)
        k3 = rhs(u + 0.5 * dt * k2)
        k4 = rhs(u + dt * k3)
        u += dt * (k1 + 2.0 * k2 + 2.0 * k3 + k4) / 6.0
        # Explicitly enforce the same Dirichlet values after the RK update too.
        max_boundary_error = max(max_boundary_error, float(np.max(np.abs(u[:, [0, -1]]))))
        u[:, [0, -1]] = 0.0
        min_u = min(min_u, float(u.min()))
        max_u = max(max_u, float(u.max()))
    if not np.isfinite(u).all():
        raise ArithmeticError("Non-finite PDE solution")
    a2 = 2.0 / np.pi * np.trapezoid(u * np.sin(2.0 * x), x=x, axis=1)
    metadata = {
        "intervals": intervals, "points": intervals + 1, "h": h, "dt": dt,
        "steps": steps, "step_factor": step_factor,
        "diffusive_number": c["D"] * dt / h**2,
        "diffusive_RK4_negative_axis_bound": 4.0 * c["D"] * dt / h**2,
        "advective_CFL_bound": 2.0 * float(np.max(np.abs(lam))) * max_u * dt / h,
        "cell_Peclet_bound": 2.0 * float(np.max(np.abs(lam))) * max_u * h / c["D"],
        "boundary_error_max": max_boundary_error, "minimum_u_over_steps": min_u,
        "maximum_u_over_steps": max_u,
    }
    return x, u, a2, metadata


def nonlinear_example():
    c = PARAMETERS["c3"]
    cases = [(lam, eps) for lam in c["lambdas"] for eps in c["epsilons"]]
    solutions = {}
    records = []
    runs = []
    t = c["target_time"]
    for intervals in c["intervals"]:
        for factor in c["diffusive_step_factors"]:
            x, u, a2, info = integrate(intervals, factor, cases)
            solutions[intervals, factor] = (u, a2)
            runs.append(info)
            for i, (lam, eps) in enumerate(cases):
                limit = -lam / (2.0 * c["D"]) * (math.exp(-2.0*c["D"]*t) - math.exp(-4.0*c["D"]*t))
                prediction = eps**2 * limit
                row = {
                    "intervals": intervals, "step_factor": factor, "dt": info["dt"],
                    "steps": info["steps"], "lambda": lam, "epsilon": eps,
                    "a2": float(a2[i]), "a2_over_epsilon_squared": float(a2[i] / eps**2),
                    "second_order_prediction": prediction,
                    "difference_from_second_order": float(a2[i] - prediction),
                    "scaled_difference_from_limit": float(a2[i] / eps**2 - limit),
                    "relative_difference": None if lam == 0 else float((a2[i] - prediction) / prediction),
                    "lambda_zero_heat_profile_error": None,
                    "lambda_zero_semidiscrete_time_error": None,
                }
                if lam == 0:
                    exact_heat = eps * math.exp(-c["D"] * t) * np.sin(x)
                    row["lambda_zero_heat_profile_error"] = float(np.max(np.abs(u[i] - exact_heat)))
                    discrete_decay = 4.0 * c["D"] * math.sin((c["length"] / intervals) / 2.0)**2 / (c["length"] / intervals)**2
                    exact_discrete = eps * math.exp(-discrete_decay * t) * np.sin(x)
                    row["lambda_zero_semidiscrete_time_error"] = float(np.max(np.abs(u[i] - exact_discrete)))
                records.append(row)

    fine_factor = min(c["diffusive_step_factors"])
    grids = c["intervals"]
    grid_comparisons = []
    for small, large in zip(grids, grids[1:]):
        coarse_u, coarse_a2 = solutions[small, fine_factor]
        fine_u, fine_a2 = solutions[large, fine_factor]
        grid_comparisons.append({
            "coarse_intervals": small, "fine_intervals": large,
            "profile_difference_max_all_cases": float(np.max(np.abs(coarse_u - fine_u[:, ::2]))),
            "a2_difference_max_all_cases": float(np.max(np.abs(coarse_a2 - fine_a2))),
        })
    time_comparisons = []
    for intervals in grids:
        original_u, original_a2 = solutions[intervals, max(c["diffusive_step_factors"])]
        half_u, half_a2 = solutions[intervals, fine_factor]
        time_comparisons.append({
            "intervals": intervals,
            "profile_difference_max_all_cases": float(np.max(np.abs(original_u - half_u))),
            "a2_difference_max_all_cases": float(np.max(np.abs(original_a2 - half_a2))),
            "note": "Rounded-up step counts give approximately, not exactly, halved dt.",
        })
    u_fine, a2_fine = solutions[grids[-1], fine_factor]
    a2_middle = solutions[grids[-2], fine_factor][1]
    a2_coarse = solutions[grids[0], fine_factor][1]
    asymptotic_comparisons = []
    for i, (lam, eps) in enumerate(cases):
        if lam == 0:
            continue
        limit = -lam / (2.0 * c["D"]) * (math.exp(-2.0*c["D"]*t) - math.exp(-4.0*c["D"]*t))
        richardson = a2_fine[i] + (a2_fine[i] - a2_middle[i]) / 3.0
        observed_order = math.log2(abs((a2_coarse[i] - a2_middle[i]) / (a2_middle[i] - a2_fine[i])))
        asymptotic_comparisons.append({
            "lambda": lam, "epsilon": eps, "analytic_scaled_limit": limit,
            "finest_a2": float(a2_fine[i]),
            "observed_spatial_order_a2": observed_order,
            "richardson_a2_estimate": float(richardson),
            "estimated_finest_spatial_error_a2": float(abs(richardson - a2_fine[i])),
            "richardson_scaled_difference": float(richardson / eps**2 - limit),
            "note": "Richardson is a spatial error estimate, not an exact finite-amplitude solution.",
        })
    zero_ids = [i for i, case in enumerate(cases) if case[0] == 0]
    positive_ids = [i for i, case in enumerate(cases) if case[0] == 0.5]
    negative_ids = [i for i, case in enumerate(cases) if case[0] == -0.5]
    symmetry_error = max(float(np.max(np.abs(u_fine[i] - u_fine[j, ::-1]))) for i, j in zip(positive_ids, negative_ids))
    summary = {
        "method": "centered face-flux finite differences; classical RK4; trapezoidal sine projection",
        "runs": runs, "case_count": len(cases), "records": len(records),
        "grid_comparisons": grid_comparisons, "time_comparisons": time_comparisons,
        "asymptotic_comparisons": asymptotic_comparisons,
        "lambda_zero_a2_max_finest": float(np.max(np.abs(a2_fine[zero_ids]))),
        "lambda_sign_reflection_profile_error_max_finest": symmetry_error,
        "specified_second_order_reference": -0.000552477704796,
    }
    return summary, records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    c1, profiles = steady_example()
    c2 = tangent_example()
    c3, harmonics = nonlinear_example()
    checks = []

    def check(name, passed, measured):
        checks.append({"name": name, "passed": bool(passed), "measured": measured})

    check("C1 positive background", c1["density_min"] > 0, c1["density_min"])
    check("C1 zero flux", max(c1["max_flux_residual"]) < 1e-14, c1["max_flux_residual"])
    check("C2 full rank and recovery", c2["independent"]["rank"] == 2 and c2["independent"]["coefficient_error_max"] < 1e-14, c2["independent"]["recovered"])
    check("C2 dependent rows and nonuniqueness", c2["dependent"]["rank"] == 1 and max(c2["dependent"]["candidate_residual_max"]) < 1e-14, c2["dependent"]["candidate_residual_max"])
    check("C3 Dirichlet endpoints exact", all(r["boundary_error_max"] == 0 for r in c3["runs"]), max(r["boundary_error_max"] for r in c3["runs"]))
    check("C3 bounded solution", all(r["minimum_u_over_steps"] >= -1e-14 and r["maximum_u_over_steps"] <= 0.1 + 1e-14 for r in c3["runs"]), [[r["minimum_u_over_steps"], r["maximum_u_over_steps"]] for r in c3["runs"]])
    check("C3 conservative stability limits", all(r["diffusive_number"] <= 0.2 + 1e-14 and r["advective_CFL_bound"] < 0.1 and r["cell_Peclet_bound"] < 0.1 for r in c3["runs"]), [[r["diffusive_number"], r["advective_CFL_bound"], r["cell_Peclet_bound"]] for r in c3["runs"]])
    time_error = max(r["profile_difference_max_all_cases"] for r in c3["time_comparisons"])
    check("C3 dt refinement", time_error < 1e-10, time_error)
    check("C3 second-order spatial convergence", all(1.9 < r["observed_spatial_order_a2"] < 2.1 for r in c3["asymptotic_comparisons"]), [r["observed_spatial_order_a2"] for r in c3["asymptotic_comparisons"]])
    check("C3 lambda zero second harmonic", c3["lambda_zero_a2_max_finest"] < 1e-14, c3["lambda_zero_a2_max_finest"])
    heat_rows = [r for r in harmonics if r["lambda"] == 0 and r["epsilon"] == 0.1 and r["step_factor"] == 0.1]
    heat_errors = [r["lambda_zero_heat_profile_error"] for r in heat_rows]
    heat_orders = [math.log2(a / b) for a, b in zip(heat_errors, heat_errors[1:])]
    check("C3 exact heat solution spatial convergence", all(1.9 < order < 2.1 for order in heat_orders), heat_orders)
    time_heat_error = max(r["lambda_zero_semidiscrete_time_error"] for r in heat_rows)
    check("C3 exact semidiscrete heat evolution", time_heat_error < 1e-12, time_heat_error)
    check("C3 lambda sign reflection", c3["lambda_sign_reflection_profile_error_max_finest"] < 1e-12, c3["lambda_sign_reflection_profile_error_max_finest"])
    positive = [r for r in c3["asymptotic_comparisons"] if r["lambda"] == 0.5]
    errors = [abs(r["richardson_scaled_difference"]) for r in positive]
    check("C3 scaled response approaches analytic limit", errors[0] < errors[1] < errors[2] and errors[0] < 0.001 * abs(positive[0]["analytic_scaled_limit"]), errors)
    reference = next(r for r in harmonics if r["intervals"] == 256 and r["step_factor"] == 0.1 and r["lambda"] == 0.5 and r["epsilon"] == 0.1)
    check("C3 stated asymptotic reference", abs(reference["second_order_prediction"] - c3["specified_second_order_reference"]) < 1e-15, reference["second_order_prediction"])
    d = PARAMETERS["c3"]["D"]
    t = PARAMETERS["c3"]["target_time"]
    e2, e4 = math.exp(-2.0 * d * t), math.exp(-4.0 * d * t)
    ode_residuals = []
    for lam in PARAMETERS["c3"]["lambdas"]:
        b2 = -lam / (2.0 * d) * (e2 - e4)
        b2_prime = lam * (e2 - 2.0 * e4)
        ode_residuals.append(b2_prime + 4.0 * d * b2 + lam * e2)
    check("C3 analytic b2 ODE residual", max(abs(x) for x in ode_residuals) < 1e-14, ode_residuals)
    # Direct finite differences of the prescribed closure at n0=1,p0=0.
    step = 1e-4
    derivative_checks = []
    for lam in PARAMETERS["c3"]["lambdas"]:
        flux = lambda n, p: -p + lam * (n - 1.0)**2
        fn = (flux(1.0 + step, 0.0) - flux(1.0 - step, 0.0)) / (2.0 * step)
        fp = (flux(1.0, step) - flux(1.0, -step)) / (2.0 * step)
        fnn = (flux(1.0 + step, 0.0) - 2.0 * flux(1.0, 0.0) + flux(1.0 - step, 0.0)) / step**2
        derivative_checks.append({"lambda": lam, "F_n": fn, "F_p": fp, "F_nn": fnn, "expected_F_nn": 2.0 * lam})
    check("C3 equal tangent, distinct Hessian", all(abs(r["F_n"]) < 1e-12 and abs(r["F_p"] + 1.0) < 1e-12 and abs(r["F_nn"] - r["expected_F_nn"]) < 1e-10 for r in derivative_checks), derivative_checks)
    result = {
        "scope": "Prescribed dimensionless mathematical examples; no experimental or turbulence-mechanism validation.",
        "parameters": PARAMETERS,
        "environment": {"python": platform.python_version(), "numpy": np.__version__, "floating_point": "float64"},
        "script_sha256": hashlib.sha256(Path(__file__).read_bytes().replace(b"\r\n", b"\n")).hexdigest(),
        "c1": c1, "c2": c2, "c3": c3, "closure_derivative_checks": derivative_checks,
        "checks": checks, "all_checks_passed": all(row["passed"] for row in checks),
    }
    write_csv(args.output_dir / "c1-profiles.csv", profiles)
    write_csv(args.output_dir / "c3-harmonics.csv", harmonics)
    (args.output_dir / "results.json").write_text(json.dumps(result, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps({"c1": c1, "c2": c2, "c3_reference_case": reference, "c3_asymptotic": c3["asymptotic_comparisons"], "checks": checks}, indent=2, allow_nan=False))
    if not result["all_checks_passed"]:
        raise SystemExit("FAILED: " + ", ".join(row["name"] for row in checks if not row["passed"]))


if __name__ == "__main__":
    main()
