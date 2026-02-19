# Contributing to Abyss

We use a feature-branch workflow and automated releasing via GitHub Actions.

## Getting Started

1.  Clone the repository: `git clone https://github.com/ajoralabs/abyss.git`
2.  Install dependencies: `bun install`
3.  Start development server: `bun dev`

## Branching Strategy

-   **`main`**: The production branch. Do not commit directly to `main`.
-   **Feature Branches**: Create a new branch for every feature or fix.
    -   `feature/my-new-feature`
    -   `fix/bug-fix`

## Making Changes

1.  Create a branch: `git checkout -b feature/amazing-feature`
2.  Make your code changes.
3.  **Add a Changeset**: If your changes affect published packages, run:
    ```bash
    npx changeset
    ```
    Follow the prompts to select packages and bump types (major/minor/patch).
4.  Commit your changes: `git commit -m "feat: add amazing feature"`
5.  Push to GitHub: `git push -u origin feature/amazing-feature`
6.  Open a Pull Request (PR) against `main`.

## Release Process

Releases are automated using GitHub Actions.

1.  When a PR is merged to `main`, the **Release** action runs.
2.  If there are new changesets, the action will create a **"Version Packages"** PR.
3.  Merging the "Version Packages" PR will trigger the action again to:
    -   Build the project.
    -   Publish packages to npm.
    -   Create GitHub Releases.

## Secrets

Ensure the following secrets are set in your GitHub Repository settings:

-   `NPM_TOKEN`: An automation token from npm for publishing packages.
