# Basic Calculator – Veda Technology Internship Day 7

A responsive, keyboard-friendly calculator for everyday arithmetic. It is built with plain HTML, CSS, and JavaScript and runs entirely in the browser with no dependencies or backend.

## Features

- Addition, subtraction, multiplication, and division
- Decimal and positive or negative number input
- Chained calculations, clear, sign toggle, and backspace
- Keyboard support for digits, `+`, `-`, `*`, `/`, `.`, Enter, Backspace, and Escape
- Friendly handling of division by zero and invalid results
- Responsive layout, accessible button labels, and visible keyboard focus

## Technologies

- HTML5
- CSS3, including CSS Grid and responsive media queries
- Vanilla JavaScript

## Run Locally

1. Open the `basic-calculator` folder in VS Code.
2. Open `index.html` in a browser. No server or package installation is required.
3. Alternatively, use VS Code's **Open with Live Server** command if that extension is already installed.

## How the Calculator Works

The JavaScript stores the current input, previous number, selected operator, and whether the next operand is being entered. When another operator is selected, the pending operation is calculated first, allowing left-to-right chained calculations. Arithmetic is handled with an explicit `switch` statement; `eval()` and the `Function()` constructor are not used. Results are rounded to 12 significant digits to avoid common floating-point display artifacts.

## Error Handling

Division by zero displays **Cannot divide by zero** instead of `Infinity`. Non-finite or invalid results are replaced by a readable error. Pressing a digit or Clear recovers from an error. Consecutive binary operators are ignored until an operand is entered.

## Deployment: GitHub Pages

1. Create a GitHub repository and add the contents of this `basic-calculator` folder to the repository root (so `index.html` is at the root).
2. Push the files to GitHub.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/(root)`, then save.
5. GitHub Pages will publish the site at `https://<username>.github.io/<repository>/` after deployment completes.

All asset references are relative, so the project works as a static GitHub Pages site without a backend.

## Project Links

- GitHub repository: `https://github.com/<username>/<repository>`
- Live demo: `https://<username>.github.io/<repository>/`