# 🧪 Testing Guide

Panduan komprehensif untuk testing KoalaStore WhatsApp Bot.

## 🎯 Testing Overview

Testing adalah bagian penting dari development cycle untuk memastikan bot berfungsi dengan baik dan reliable. Dokumentasi ini cover berbagai aspek testing dari unit test hingga manual testing.

## 📋 Testing Strategy

### 1. Testing Pyramid

```
                    /\
                   /  \
                  /    \
                 /  E2E  \
                /________\
               /          \
              /Integration \
             /______________\
            /                \
           /   Unit Tests     \
          /____________________\
```

**Unit Tests (70%)**
- Test individual functions
- Command logic testing
- Manager class testing
- Utility function testing

**Integration Tests (20%)**
- Service integration testing
- Database operations
- WhatsApp API integration
- Command flow testing

**E2E Tests (10%)**
- Full bot workflow testing
- Real WhatsApp interaction
- User scenario testing

## 🔧 Test Setup

### Dependencies

```bash
# Install testing dependencies
npm install --save-dev jest supertest sinon

# Install additional testing utilities
npm install --save-dev @jest/globals jest-environment-node
```

### Jest Configuration

Create `jest.config.js`:

```javascript
export default {
  testEnvironment: 'node',
  moduleType: 'module',
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/src/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};
```

### Test Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e"
  }
}
```

## 🧩 Unit Testing

### Testing Commands

Example test untuk command:

```javascript
// tests/unit/commands/general/ping.test.js
import { jest } from '@jest/globals';
import pingCommand from '../../../../src/commands/general/ping.js';

describe('Ping Command', () => {
  let mockContext;

  beforeEach(() => {
    mockContext = {
      messageService: {
        reply: jest.fn()
      },
      user: {
        id: '628123456789',
        name: 'Test User'
      }
    };
  });

  test('should respond with pong and latency', async () => {
    const start = Date.now();
    
    await pingCommand(mockContext, []);
    
    expect(mockContext.messageService.reply).toHaveBeenCalledWith(
      expect.stringContaining('🏓 Pong!')
    );
    expect(mockContext.messageService.reply).toHaveBeenCalledWith(
      expect.stringContaining('ms')
    );
  });

  test('should handle errors gracefully', async () => {
    mockContext.messageService.reply.mockRejectedValue(new Error('Network error'));
    
    // Should not throw
    await expect(pingCommand(mockContext, [])).resolves.not.toThrow();
  });
});
```

### Testing Data Managers

```javascript
// tests/unit/models/ListManager.test.js
import { jest } from '@jest/globals';
import ListManager from '../../../src/models/ListManager.js';
import fs from 'fs/promises';

// Mock fs module
jest.mock('fs/promises');

describe('ListManager', () => {
  let listManager;
  
  beforeEach(() => {
    listManager = new ListManager();
    jest.clearAllMocks();
  });

  describe('addList', () => {
    test('should add new product to list', async () => {
      const mockData = [];
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      fs.writeFile.mockResolvedValue();

      await listManager.addList('Netflix', 'Premium account');

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('list-produk.json'),
        expect.stringContaining('Netflix')
      );
    });

    test('should handle duplicate products', async () => {
      const mockData = [
        { name: 'Netflix', description: 'Existing product' }
      ];
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));

      await expect(
        listManager.addList('Netflix', 'Duplicate')
      ).rejects.toThrow('Product already exists');
    });
  });
});
```

## 🔗 Integration Testing

### Testing Command Flow

```javascript
// tests/integration/commandFlow.test.js
import { jest } from '@jest/globals';
import WhatsAppBot from '../../src/WhatsAppBot.js';

describe('Command Flow Integration', () => {
  let bot;
  let mockClient;

  beforeEach(async () => {
    bot = new WhatsAppBot();
    
    // Mock WhatsApp client
    mockClient = {
      sendMessage: jest.fn(),
      user: { id: '628999999999@s.whatsapp.net' }
    };
    
    bot.client = mockClient;
    await bot.loadCommands();
  });

  test('should process help command end-to-end', async () => {
    const mockMessage = {
      key: {
        remoteJid: '628123456789@s.whatsapp.net',
        fromMe: false,
        id: 'msg123'
      },
      message: {
        conversation: 'help'
      },
      messageTimestamp: Date.now(),
      pushName: 'Test User'
    };

    // Simulate message processing
    await bot.messageHandler.process(mockClient, {
      messages: [mockMessage],
      type: 'notify'
    });

    expect(mockClient.sendMessage).toHaveBeenCalledWith(
      '628123456789@s.whatsapp.net',
      expect.objectContaining({
        text: expect.stringContaining('KOALA STORE')
      }),
      expect.any(Object)
    );
  });
});
```

## 🌐 E2E Testing

### WhatsApp Integration Testing

```javascript
// tests/e2e/whatsapp.test.js
import WhatsAppBot from '../../src/WhatsAppBot.js';

describe('WhatsApp E2E Tests', () => {
  let bot;
  
  beforeAll(async () => {
    // Only run if in test environment with real session
    if (process.env.NODE_ENV !== 'e2e') {
      pending('E2E tests require real WhatsApp session');
    }
    
    bot = new WhatsAppBot();
    await bot.start();
  }, 30000);

  afterAll(async () => {
    if (bot) {
      await bot.stop();
    }
  });

  test('should respond to ping command', async () => {
    const testJid = process.env.TEST_JID; // Test group/contact
    
    if (!testJid) {
      pending('TEST_JID environment variable required');
    }

    // Send test message
    await bot.services.messageService.sendText(testJid, 'ping');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if response was received
    // This would require implementing a message capture mechanism
  }, 10000);
});
```

## 📊 Manual Testing

### Testing Checklist

#### General Commands
- [ ] `help` - Shows help menu
- [ ] `ping` - Returns pong with latency
- [ ] `allmenu` - Shows all commands
- [ ] `owner` - Shows owner contact

#### Store Commands
- [ ] `list` - Shows product list (group only)
- [ ] `testi` - Shows testimonials
- [ ] `testi` - Shows testimonials (private only)

#### Admin Commands (in group)
- [ ] `addlist` - Adds product to list
- [ ] `dellist` - Removes product from list
- [ ] `proses` - Sends processing message
- [ ] `done` - Sends completion message
- [ ] `kick` - Kicks member (reply to message)

#### Owner Commands
- [ ] `addproduk` - Adds product to catalog
- [ ] `delproduk` - Removes product from catalog
- [ ] `broadcast` - Sends broadcast message
- [ ] `mode` - Changes bot mode

### Manual Test Scenarios

#### Scenario 1: New Customer Journey
1. Customer joins group
2. Welcome message appears
3. Customer types `list`
4. Customer sees product list
5. Customer types `testi`
6. Customer sees testimonials

#### Scenario 2: Order Processing
1. Customer sends order message
2. Admin replies with `proses`
3. Customer receives processing template
4. Admin completes order
5. Admin replies with `done`
6. Customer receives completion template

#### Scenario 3: Admin Management
1. Admin adds new product with `addlist`
2. Product appears in list
3. Admin updates product description
4. Admin removes old product
5. List is updated correctly

## 📝 Testing Best Practices

### 1. Test Organization

```
tests/
├── unit/
│   ├── commands/
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/
│   ├── database/
│   ├── services/
│   └── workflows/
├── e2e/
│   ├── user-scenarios/
│   └── whatsapp-integration/
├── fixtures/
│   ├── database/
│   └── messages/
└── mocks/
    ├── WhatsAppClient.js
    └── Database.js
```

### 2. Test Naming Convention

```javascript
// ✅ Good: Descriptive test names
describe('ListManager', () => {
  describe('addList', () => {
    test('should add new product when valid data provided', () => {});
    test('should throw error when product already exists', () => {});
    test('should validate required fields before adding', () => {});
  });
});

// ❌ Bad: Vague test names
describe('ListManager', () => {
  test('test1', () => {});
  test('test add', () => {});
});
```

### 3. Async Testing

```javascript
// ✅ Good: Proper async testing
test('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// ✅ Good: Test error scenarios
test('should handle async errors', async () => {
  await expect(asyncFunction()).rejects.toThrow('Expected error');
});
```

---

**🧪 Testing Philosophy:**
- Write tests before fixing bugs
- Test the behavior, not implementation
- Keep tests simple and focused
- Maintain good test coverage
- Use real data in integration tests 