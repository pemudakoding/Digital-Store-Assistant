# 🤝 Contributing Guide

Panduan lengkap untuk berkontribusi pada KoalaStore WhatsApp Bot project.

## 🎯 How to Contribute

Ada banyak cara untuk berkontribusi:

- 🐛 **Bug Reports** - Laporkan bug yang Anda temukan
- 💡 **Feature Requests** - Usulkan fitur baru  
- 📝 **Documentation** - Improve atau tambah dokumentasi
- 🔧 **Code Contributions** - Submit pull requests
- 🧪 **Testing** - Test fitur dan laporkan hasil
- 🎨 **UI/UX** - Improve user experience
- 🌍 **Translations** - Tambah dukungan bahasa

## 🚀 Getting Started

### 1. Fork Repository

```bash
# Fork di GitHub, lalu clone
git clone https://github.com/yourusername/KoalaStore.git
cd KoalaStore

# Add upstream remote
git remote add upstream https://github.com/originalowner/KoalaStore.git
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi development Anda

# Run dalam development mode
npm run dev
```

### 3. Create Feature Branch

```bash
# Create dan switch ke branch baru
git checkout -b feature/amazing-feature

# Atau untuk bugfix
git checkout -b bugfix/fix-issue-123
```

## 📋 Development Standards

### Code Style

Ikuti standards yang sudah ditetapkan di `.cursor/rules/basic-standards.mdc`:

#### JavaScript Style
```javascript
// ✅ Good
const userMessage = "Hello World";
const userData = await getUserData(userId);

// ❌ Bad  
const usermessage = "Hello World";
const user_data = await getUserData(userId);
```

#### File Organization
```javascript
// ✅ Good - Import order
import fs from "fs";
import path from "path";
import { someFunction } from "./utils/helpers.js";

// Class/function definition
export default class ExampleManager {
    constructor() {
        // Implementation
    }
}
```

#### Error Handling
```javascript
// ✅ Good
try {
    const result = await riskyOperation();
    return result;
} catch (error) {
    console.error('Operation failed:', error);
    throw new Error('User-friendly error message');
}

// ❌ Bad
const result = await riskyOperation(); // No error handling
```

### Commit Messages

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(scope): <description>

# Examples
feat(commands): add product search functionality
fix(database): resolve duplicate entry issue  
docs(readme): update installation guide
style(commands): improve code formatting
refactor(managers): simplify ListManager logic
test(commands): add tests for store commands
chore(deps): update baileys to latest version
```

#### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Branch Naming

```bash
# Features
feature/command-search
feature/admin-dashboard
feature/automation-enhancement

# Bug fixes
bugfix/message-send-error
bugfix/session-timeout
hotfix/critical-security-issue

# Documentation
docs/api-reference
docs/contributing-guide

# Refactoring
refactor/database-layer
refactor/command-handler
```

## 🧪 Testing

### Manual Testing

Sebelum submit PR, test manual:

```bash
# Start bot in development
npm run dev

# Test commands di WhatsApp:
help
ping
list
addlist Test Product|Test Description
```

### Automated Testing (Future)

```bash
# Run tests (ketika sudah diimplementasi)
npm test

# Run linting
npm run lint

# Run formatting
npm run format
```

### Testing Checklist

- [ ] Bot starts without errors
- [ ] Basic commands work (`help`, `ping`)
- [ ] Store commands work (`list`, `testi`, `produk`)
- [ ] Admin commands work (if applicable)
- [ ] Owner commands work (if applicable)
- [ ] Error handling works properly
- [ ] No memory leaks in long-running tests

## 📝 Pull Request Process

### 1. Pre-submission Checklist

- [ ] Code follows style guidelines
- [ ] Commit messages follow conventional format
- [ ] Changes are tested manually
- [ ] Documentation updated (if needed)
- [ ] No merge conflicts with main branch
- [ ] PR description explains changes clearly

### 2. PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Manual testing with WhatsApp
- [ ] Automated tests (if available)
- [ ] Testing on different environments

## Screenshots (if applicable)
Add screenshots of new features or UI changes.

## Additional Notes
Any additional information for reviewers.
```

### 3. Review Process

1. **Automated checks** (linting, tests)
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Approval** and merge

## 🎯 Contribution Areas

### 🐛 Bug Fixes

#### How to Report Bugs

1. **Check existing issues** untuk duplikasi
2. **Use bug report template:**

```markdown
**Bug Description**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Send command '...'
2. Wait for response
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. Windows 10]
- Node.js version: [e.g. 20.0.0]
- Bot version: [e.g. 2.0.0]

**Additional Context**
Add any other context about the problem.
```

#### Bug Fix Guidelines

```javascript
// ✅ Good bug fix
export default async function buggyCommand(context) {
    const { messageService, from, msg, args } = context;
    
    try {
        // Validate input first
        if (!args.length) {
            return await messageService.reply(from, "Usage: command <parameter>", msg);
        }
        
        // Fix the actual issue
        const result = await processInput(args[0]);
        
        await messageService.reply(from, result, msg);
    } catch (error) {
        console.error('Command error:', error);
        await messageService.sendError(from, 'general', msg);
    }
}
```

### 💡 New Features

#### Feature Request Process

1. **Open issue** dengan feature request template
2. **Discuss** dengan maintainers
3. **Get approval** sebelum mulai coding
4. **Implement** sesuai guidelines
5. **Submit PR** dengan dokumentasi

#### Feature Development Guidelines

```javascript
// Example: New command structure
/**
 * New Feature Command
 * Description: What this command does
 * Usage: command <parameters>
 */
export default async function newFeatureCommand(context) {
    const { messageService, from, msg, args, isGroup, isAdmin } = context;
    
    // Permission checks
    if (config.adminOnly && !isAdmin) {
        return await messageService.reply(from, mess.adminOnly, msg);
    }
    
    // Input validation
    if (!validateInput(args)) {
        return await messageService.reply(from, getUsageMessage(), msg);
    }
    
    try {
        // Feature implementation
        const result = await implementFeature(args);
        
        // Response
        await messageService.reply(from, formatResponse(result), msg);
        
        // Logging (if needed)
        logger.info(`Feature used by ${context.sender}`);
        
    } catch (error) {
        console.error('Feature error:', error);
        await messageService.sendError(from, 'general', msg);
    }
}
```

### 📚 Documentation

#### Documentation Standards

- **Clear headings** dan structure
- **Code examples** untuk setiap concept
- **Screenshots** untuk UI elements
- **Links** ke related documentation
- **Updated** ketika code berubah

#### Documentation Types

1. **User Documentation**
   - How to use features
   - Command guides
   - Troubleshooting

2. **Developer Documentation**  
   - API reference
   - Architecture guides
   - Contributing guides

3. **Installation Documentation**
   - Setup instructions
   - Configuration guides
   - Deployment guides

### 🔧 Code Improvements

#### Refactoring Guidelines

```javascript
// ✅ Good refactoring - improve readability
class ListManager {
    async addProduct(groupId, productName, description) {
        const validation = this.validateProductData(productName, description);
        if (!validation.isValid) {
            throw new Error(validation.message);
        }
        
        const product = this.createProductObject(groupId, productName, description);
        await this.saveProduct(product);
        
        return product;
    }
    
    private validateProductData(name, description) {
        if (!name || !description) {
            return { isValid: false, message: "Name and description required" };
        }
        return { isValid: true };
    }
}
```

#### Performance Improvements

```javascript
// ✅ Good - Efficient database operations
class DatabaseManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }
    
    async getData(key) {
        // Check cache first
        if (this.cache.has(key)) {
            const cached = this.cache.get(key);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        // Load from file if not cached
        const data = await this.loadFromFile(key);
        this.cache.set(key, { data, timestamp: Date.now() });
        
        return data;
    }
}
```

## 🎨 Code Review Guidelines

### For Contributors

#### Before Requesting Review

- [ ] Self-review your code
- [ ] Test all changes
- [ ] Update documentation
- [ ] Write clear PR description
- [ ] Reference related issues

#### Responding to Feedback

```markdown
// ✅ Good response
Thanks for the feedback! I've updated the code to handle edge cases better. 
The new implementation is in commit abc123.

// ❌ Poor response  
Fixed.
```

### For Reviewers

#### What to Look For

1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it readable and maintainable?
3. **Performance** - Any performance implications?
4. **Security** - Any security concerns?
5. **Tests** - Are changes tested?
6. **Documentation** - Is documentation updated?

#### Review Comments

```markdown
// ✅ Good review comment
Consider using async/await instead of callbacks here for better readability:

```javascript
// Instead of this:
getData(callback)

// Consider this:
const data = await getData()
```

This would make error handling cleaner too.

// ❌ Poor review comment
This is wrong.
```

## 🏆 Recognition

### Contributors Hall of Fame

Contributors akan diakui melalui:

- **GitHub Contributors** section
- **CONTRIBUTORS.md** file  
- **Release notes** mentions
- **Discord/Telegram** shoutouts

### Contribution Levels

🥉 **Bronze** - 1-5 PRs merged
🥈 **Silver** - 6-15 PRs merged  
🥇 **Gold** - 16+ PRs merged
💎 **Diamond** - Major contributions, long-term maintainer

## 📞 Getting Help

### Community Channels

- **GitHub Issues** - Technical questions
- **GitHub Discussions** - General discussions
- **Discord/Telegram** - Real-time chat
- **Email** - Private concerns

### Mentorship

New contributors dapat meminta mentorship:

1. **Comment** di issue dengan `@mentor-needed`
2. **Join** Discord channel #mentorship
3. **Reach out** ke maintainers directly

## 🚨 Code of Conduct

### Our Standards

- **Be respectful** dan inclusive
- **Welcome newcomers** dan help them learn
- **Focus on constructive feedback**
- **Respect different perspectives**
- **Prioritize community wellbeing**

### Enforcement

Violations will result in:
1. **Warning** untuk first offense
2. **Temporary ban** untuk repeated offenses
3. **Permanent ban** untuk serious violations

## 📋 Development Workflow

### Daily Workflow

```bash
# Start your day
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit often
git add .
git commit -m "feat(scope): add amazing feature"

# Push and create PR
git push origin feature/my-feature
# Create PR di GitHub
```

### Keeping Up to Date

```bash
# Fetch latest changes
git fetch upstream

# Update main branch
git checkout main
git merge upstream/main

# Rebase feature branch (optional)
git checkout feature/my-feature
git rebase main
```

## 🎯 Next Steps

Siap berkontribusi? Mulai dengan:

1. **[Quick Start Guide](./01-quick-start.md)** - Setup development environment
2. **[Project Structure](./04-project-structure.md)** - Understand codebase
3. **[Creating Commands](./11-creating-commands.md)** - Learn command development
4. **[GitHub Issues](https://github.com/yourusername/KoalaStore/issues)** - Find issues to work on

---

**Terima kasih** sudah mempertimbangkan untuk berkontribusi! 🎉
Kontribusi Anda, sekecil apapun, sangat berarti untuk project ini. 