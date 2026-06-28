# Frontend Tests Guide

This guide explains how to run and maintain tests for the EPF Marketplace frontend.

## Test Structure

```
src/tests/
├── setup.js              # Test configuration and mocks
├── services/             # Unit tests for API services
│   ├── authService.test.js
│   └── productService.test.js
└── integration/          # Integration tests
    └── apiIntegration.test.js
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Integration Tests Only
```bash
npm run test:integration
```

## Writing New Tests

### Unit Test Example

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { yourService } from '../../services/yourService';
import api from '../../services/api';

vi.mock('../../services/api');

describe('yourService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', async () => {
    api.get.mockResolvedValue({ data: { result: 'success' } });
    
    const result = await yourService.method();
    
    expect(api.get).toHaveBeenCalledWith('/endpoint');
    expect(result).toEqual({ result: 'success' });
  });
});
```

### Integration Test Example

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { yourService } from '../../services/yourService';

describe('Integration Test', () => {
  it('should complete full flow', async () => {
    // Test complete user flow
    const result = await yourService.method();
    expect(result).toBeDefined();
  });
});
```

## Test Coverage

Current coverage targets:
- Unit tests: 80% minimum
- Integration tests: Key user flows
- Performance tests: API response times < 500ms

View coverage report:
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## Common Issues

### Mock Not Working
Ensure you import the module correctly:
```javascript
import api from '../../services/api';
vi.mock('../../services/api');
```

### Async Test Failing
Use `await` or return the promise:
```javascript
it('should handle async', async () => {
  await asyncOperation();
});
```

### LocalStorage Not Available
The `setup.js` file mocks localStorage. If you need real localStorage in tests, modify the mock.

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to `main` branch
- Pull requests to `main` branch
- Pull requests to `develop` branch

The pipeline will fail if:
- Tests fail
- Coverage drops below 80%
- Linting fails

## Adding New Test Dependencies

```bash
npm install --save-dev @testing-library/your-library
```

Then update `vitest.config.js` if needed.
