![alt text](logo.webp)

## Juan Pablo II

Dashboard de la clínica estética Juan Pablo II

## Empezando

Primero, ejecute el servidor de desarrollo:

```bash
pnpm run dev
```

Para tanstack Table importante no quitar la declaración de modulo tipado Meta: 
```typescript
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    title: string
  }
}
```

Abrir [http://localhost:3000](http://localhost:300) con su navegador para ver el resultado.
