# Contributing Guidelines

Thank you for your interest in contributing to **ComputerPets**! We welcome contributions from developers of all skill levels. Whether you're fixing bugs, adding new features, improving documentation, or suggesting ideas, your help is appreciated.

This document explains how to get started, follow our conventions, and submit your contributions successfully.

---

## Getting Started

### 1. Fork the Repository

- Go to the main repository on GitHub
- Click the **Fork** button to create your own copy
- Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/ComputerPets.git
cd ComputerPets
```

### 2. Set Up Your Development Environment

Follow the [Setup & Installation Guide](SETUP.md) to configure your local environment.

At a minimum, you will need:

- **Java 21** (JDK)
- **Maven 3.9+**
- The three required cryptographic environment variables (`LICENSE_SECRET_KEY`, `JWT_SECRET_KEY`, `BUNDLE_SIGNING_KEY`)

We recommend using an IDE such as IntelliJ IDEA or VS Code with the Java Extension Pack.

### 3. Verify the Project Builds

Before making changes, ensure everything builds correctly:

```bash
mvn clean package
```

Then run the application:

```bash
mvn spring-boot:run
```

---

## Code Style and Conventions

We follow modern Java and Spring Boot best practices. Please follow these guidelines when contributing:

### Package Structure

- Keep related code in the appropriate package:
  - `controller/` — REST controllers (keep them thin)
  - `provider/` — Ownership verification implementations
  - `license/` — License generation and validation logic
  - `security/` — JWT and authentication components
  - `config/` — Spring configuration classes
  - `bundle/` — CDN download URL handling

### General Coding Standards

- Use **records** for simple data holders (e.g., `VerificationResult`, `LicensePayload`)
- Prefer **constructor injection** over field injection
- Keep controllers focused on HTTP concerns — move business logic to services
- Write clear, meaningful comments, especially around security and cryptographic code
- Follow existing naming conventions (`camelCase` for methods/variables, `PascalCase` for classes)

### Security Best Practices

- Never log or expose secret values
- Fail closed on any validation error
- Validate all external input, especially from third-party providers (Steam, Microsoft, itch.io, Epic, blockchain)

### Example of Preferred Style

```java
@Service
public class ExampleProvider implements OwnershipProvider {

    @Override
    public String key() {
        return "example";
    }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        // implementation
    }
}
```

---

## Making Changes and Submitting Pull Requests

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feat/your-feature-name
```

Good branch name examples:
- `feat/add-epic-games-provider`
- `fix/improve-nft-ownership-validation`
- `docs/update-setup-guide`

### 2. Make Focused, Atomic Commits

- One logical change per commit
- Write clear commit messages in the imperative mood:

```
Add real Steam Web API integration

- Implement GetOwnedGames call
- Add proper error handling
- Update tests
```

### 3. Update Documentation When Needed

If your changes affect architecture, setup, or public behavior, please update the relevant documentation:

- `docs/ARCHITECTURE.md` (especially for structural changes)
- `docs/adr/` — add or supersede an Architecture Decision Record when the change is a non-obvious choice already true in the code (see [docs/adr/README.md](adr/README.md))
- `docs/SETUP.md`
- `README.md`
- Code comments and Javadocs

When making architectural changes, remember to update the **"Last Updated"** date at the top of `docs/ARCHITECTURE.md`. Do not invent APIs, NFT collection addresses, or storefronts in ADRs.

### 4. Test Your Changes

- Run `mvn clean package` before pushing
- Add unit or integration tests when possible
- Manually verify that your changes work as expected
- Run the desk tests with `npm test` in `desktop/` and in `web/`. Both suites run on Windows, Mac, and Linux:
  - A test that reads source text uses `readSource` (`desktop/test-source.cjs`, `web/scripts/test-source.mjs`), so a Windows checkout with CRLF reads the same as Linux.
  - A web test imports a `.ts` module with `pathToFileURL(join(root, ...)).href`, not a bare path.
  - A web test that runs a repo Python script gets the command from `python3()` in `web/scripts/test-python.mjs` (python3, then python, then `py -3`).
  - A test that needs `/bin/sh` or Xvfb is skipped with a reason on Windows and runs on Linux CI.
- Run the PyQt blotter tests with pytest in `client/`. CI runs them on Linux with Python 3.12 (`client/pyproject.toml` asks for 3.11 or newer). On Windows, keep the test tools in a venv inside `client/`, which git ignores. In PowerShell:

  ```powershell
  cd client
  py -3.12 -m venv .venv
  .\.venv\Scripts\python.exe -m pip install -e ".[dev]"
  $env:QT_QPA_PLATFORM = "offscreen"
  .\.venv\Scripts\python.exe -m pytest -q -rs
  .\.venv\Scripts\python.exe -m computerpets_client --check
  ```

  - `py -0p` lists the Pythons you have. If you only have 3.10, the editable install refuses (`requires-python >=3.11`). Make the venv with `py -3` and install just the tools: `.\.venv\Scripts\python.exe -m pip install "PyQt6>=6.6" "cryptography>=42" "pytest>=8"`. `pythonpath = ["."]` in `pyproject.toml` lets pytest import the package without installing it.
  - `-rs` prints the reason for each skip. The one Windows skip is the half of `tests/test_gpu.py` that runs the POSIX `desktop/gpu-probe*.sh` scripts through `/bin/sh`.
  - A test that needs a license folder uses pytest's `tmp_path`, not a hard-coded `/tmp/...` path. When an in-memory fake disk is keyed by path, build the key with `Path(...) / name` so it matches on Windows.
  - A test that fakes `/etc/machine-id` pins the host to Linux, so a Windows run never reads the real registry GUID.
- Run everything at once with `scripts/test-all.ps1` (Windows PowerShell 5.1 or PowerShell 7) or `scripts/test-all.sh` (Linux, Mac, Git Bash). It installs nothing. It runs each suite it can, skips the rest with the reason, prints a table, and exits non-zero if any suite fails:

  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\test-all.ps1           # every suite
  powershell -ExecutionPolicy Bypass -File scripts\test-all.ps1 -Quick    # desktop, python, check, harness, cdn
  powershell -ExecutionPolicy Bypass -File scripts\test-all.ps1 -Only web,tsc
  powershell -ExecutionPolicy Bypass -File scripts\test-all.ps1 -Skip java -List
  ```

  The shell twin takes `--quick`, `--only a,b`, `--skip a,b`, and `--list`. The suites, in order:

  | Suite | What runs | Needs |
  |---|---|---|
  | `desktop` | `npm test` in `desktop/` | Node |
  | `web` | `npm test` in `web/` | `npm ci` in `web/` with npm 11 (Node 24; npm 10 says the lock is out of sync), and Python with Pillow and numpy for `walker-art.test.mjs` |
  | `tsc` | `node scripts/tsc-baseline.mjs` in `web/` | `web/node_modules` |
  | `checkjs` | `node scripts/checkjs-baseline.mjs` (tsc `checkJs` over `desktop/renderer`, `desktop/*.cjs`, `license/`, `presence/`) | `web/node_modules` (desktop uses web's TypeScript) |
  | `python` | pytest in `client/` | `client/.venv` (see above; the script prints the command when it is missing) |
  | `check` | `python -m computerpets_client --check` | `client/.venv` |
  | `harness` | `computerpets_client.app_harness` and `.care_harness` (see [APP-HARNESS.md](APP-HARNESS.md)) | `client/.venv` |
  | `cdn` | `node deploy/cdn/edge-redeem.test.cjs` | Node |
  | `java` | `mvnw verify` or `mvn verify` | Java and Maven, else skipped |
  | `deploy-sh` | every `deploy/**/*.test.sh` | bash and `python3` with PyYAML, else skipped |
  | `tftest` | `terraform test` in `deploy/terraform` | terraform and a prior `terraform init`, else skipped |

  `-Quick` leaves out `web`, `tsc`, `java`, `deploy-sh`, and `tftest`. Logs go to `%TEMP%\computerpets-test-all` (or `$TMPDIR/computerpets-test-all`). On Windows, Git Bash is not on PATH by default, so `deploy-sh` is skipped; pass `-Bash "C:\Program Files\Git\bin\bash.exe"` to try it (it still needs a real `python3`, not the Store alias).

  **deploy-sh on Windows.** The deploy meta-tests run under bash and call `python3` with PyYAML. Git Bash uses the Windows `PATH`, and on many Windows computers `python3` there is the Microsoft Store alias (it prints "Python was not found"), so `test-all` skips the suite with "python3 with PyYAML is not available to bash". To run it, once:
  1. Install PyYAML into your real Python: `py -3 -m pip install --user pyyaml`.
  2. Let bash find that Python as `python3`: turn off the `python3.exe` alias in Settings > Apps > Advanced app settings > App execution aliases, then put a `python3.exe` on `PATH`. The python.org installer only ships `python.exe`, so copy it to `python3.exe` in the same folder (for example `C:\Users\<you>\AppData\Local\Programs\Python\Python310`), or use the Microsoft Store Python, which has `python3`.
  3. Check it: `& "C:\Program Files\Git\bin\bash.exe" -c "python3 -c 'import yaml; print(yaml.__version__)'"` prints a version.

  Then `-Bash "C:\Program Files\Git\bin\bash.exe"` runs `deploy-sh`. `test-all` itself never installs these.
- `web` has 1,593 known TypeScript errors at last count; `web/tsc-baseline.txt` always holds the current number (the line count of `tsc --noEmit`). `node scripts/tsc-baseline.mjs` in `web/` fails when the count goes up and passes with a note when it goes down. After you fix some, lock in the lower number with `node scripts/tsc-baseline.mjs --update` and commit `web/tsc-baseline.txt`. CI runs the web tests and this check in the `web-desk` job.
- The desktop JavaScript is type-checked too: `node scripts/checkjs-baseline.mjs` runs tsc `checkJs` with `desktop/tsconfig.checkjs.json` and compares the error count with `desktop/checkjs-baseline.txt` (58 at last count). More errors fail, fewer pass with a note; lock in the lower number with `node scripts/checkjs-baseline.mjs --update`, and `--list` prints every error. `desktop/types/renderer-globals.d.ts` types the `window.Pet*` globals from each module's own exports, and `desktop/types/electron.d.ts` stands in for Electron so the count is the same with or without `desktop/node_modules`.
- Shell scripts are LF on every checkout (`*.sh text eol=lf` in `.gitattributes`). On a Windows clone made before that line, re-check them out once in PowerShell: `$sh = git ls-files "*.sh"; Remove-Item $sh; git checkout -- $sh`

### 5. Open a Pull Request

- Push your branch and open a Pull Request against the `main` branch
- Use the **Pull Request Template** provided by the repository
- Clearly describe what your change does and why it is needed
- Link any related issues (e.g., `Closes #42`)

### 6. Respond to Review Feedback

Be responsive and collaborative during code review. We aim to keep reviews friendly and constructive.

---

## Important Rules and Notes

- **Architecture changes** should be discussed in an issue before large implementation work begins.
- **New ownership providers** should follow the existing `OwnershipProvider` interface and be placed in their own sub-package under `provider/`.
- **Security-related changes** will receive additional review.
- The project currently has **limited test coverage** — contributions that add tests are highly valued.
- Please do not commit real cryptographic keys or secrets.

---

## Getting Help

If you have questions or need guidance:

- Open a **GitHub Discussion** for general questions
- Create an **Issue** with the `question` label
- Feel free to mention maintainers in your pull request if you need a review

We are happy to help new contributors get their first pull request merged.

---

Thank you for contributing to ComputerPets! Every improvement helps make the project better.

We look forward to reviewing your contributions. 🐾