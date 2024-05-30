import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import Page from '../src/app/page';

// Testing components in this way will probably require mocking Prisma Client
describe('Page', () => {
  it('renders a heading', async () => {
    // render(await Page());
 
    // const heading = screen.getByRole('heading', { level: 1 })
 
    // expect(heading).toBeInTheDocument()
    // expect(heading).toHaveTextContent('Hello, World!')
  })
})