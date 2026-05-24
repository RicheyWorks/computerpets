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
- Validate all external input, especially from third-party providers (Steam, Microsoft, blockchain)

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
- `docs/SETUP.md`
- `README.md`
- Code comments and Javadocs

When making architectural changes, remember to update the **"Last Updated"** date at the top of `docs/ARCHITECTURE.md`.

### 4. Test Your Changes

- Run `mvn clean package` before pushing
- Add unit or integration tests when possible
- Manually verify that your changes work as expected

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