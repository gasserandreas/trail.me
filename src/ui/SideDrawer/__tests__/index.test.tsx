import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';

import SideDrawer from '../index';

describe('SideDrawer test suite', () => {
  const testId = 'side-drawer';

  it('should render properly', async () => {
    const text = 'test text';
    render(<SideDrawer data-testid={testId}>{text}</SideDrawer>);

    await waitFor(() => screen.getByTestId(testId));
    expect(screen.getByTestId(testId)).toHaveTextContent(text);
  });
});
