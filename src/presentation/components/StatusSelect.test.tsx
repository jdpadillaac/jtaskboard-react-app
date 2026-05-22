import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StatusSelect from './StatusSelect';

describe('StatusSelect', () => {
    it('muestra el estado actual como badge', () => {
        render(<StatusSelect status="TODO" onChange={vi.fn()} />);
        expect(screen.getByText('Por hacer')).toBeInTheDocument();
    });

    it('abre el menu al hacer click en el boton', async () => {
        render(<StatusSelect status="TODO" onChange={vi.fn()} />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('llama onChange con el nuevo estado al seleccionar uno diferente', async () => {
        const onChange = vi.fn();
        render(<StatusSelect status="TODO" onChange={onChange} />);
        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByRole('menuitem', { name: /completada/i }));
        expect(onChange).toHaveBeenCalledWith('DONE');
    });

    it('no llama onChange si se selecciona el mismo estado', async () => {
        const onChange = vi.fn();
        render(<StatusSelect status="TODO" onChange={onChange} />);
        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByRole('menuitem', { name: /por hacer/i }));
        expect(onChange).not.toHaveBeenCalled();
    });

    it('no abre el menu si esta deshabilitado', async () => {
        render(<StatusSelect status="TODO" onChange={vi.fn()} disabled />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
});
