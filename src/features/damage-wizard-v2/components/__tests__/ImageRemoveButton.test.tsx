import { render, screen, fireEvent } from '@testing-library/react';
import { ImageRemoveButton } from '../ImageRemoveButton';

describe('ImageRemoveButton', () => {
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    mockOnRemove.mockClear();
  });

  it('renders with default props', () => {
    render(<ImageRemoveButton onRemove={mockOnRemove} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('×');
    expect(button).toHaveAttribute('aria-label', 'Eliminar imagen');
  });

  it('renders with custom label', () => {
    const customLabel = 'Eliminar imagen de perfil';
    render(<ImageRemoveButton onRemove={mockOnRemove} label={customLabel} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', customLabel);
  });

  it('calls onRemove when clicked', () => {
    render(<ImageRemoveButton onRemove={mockOnRemove} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const customClass = 'h-8 w-8 test-class';
    render(<ImageRemoveButton onRemove={mockOnRemove} className={customClass} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('w-8');
    expect(button).toHaveClass('test-class');
  });

  it('has correct default styling classes', () => {
    render(<ImageRemoveButton onRemove={mockOnRemove} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('absolute');
    expect(button).toHaveClass('-top-2');
    expect(button).toHaveClass('-right-2');
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('opacity-0');
    expect(button).toHaveClass('group-hover:opacity-100');
    expect(button).toHaveClass('transition-opacity');
  });

  it('has type="button" to prevent form submission', () => {
    render(<ImageRemoveButton onRemove={mockOnRemove} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
