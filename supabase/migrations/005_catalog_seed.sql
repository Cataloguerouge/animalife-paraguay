insert into public.products
  (sku, slug, name, brand, category_id, animal, description, package_size, price_pyg, stock, image_path, verified, regulated, requires_prescription, featured, active)
values
  (
    'FINO-PRIME-15',
    'finotrato-prime-15kg',
    'FINOTRATO PRIME',
    'VB Alimentos',
    (select id from public.categories where slug='perros'),
    'PERROS',
    'Alimento completo para perros. Presentación de 15 kg. Variante comercial pendiente de verificación.',
    '15 kg',
    0, 0, null, false, false, false, true, true
  ),
  (
    'FLUR-BOV-1L',
    'fluralab-bovinos-5-1l',
    'FLURALAB BOVINOS 5%',
    'LABETS',
    (select id from public.categories where slug='bovinos'),
    'BOVINOS',
    'Fluralaner 5% para bovinos, presentación 1 L. Precio de referencia cargado; stock y condiciones de venta deben confirmarse.',
    '1 L',
    669999, 0, null, false, true, false, true, true
  ),
  (
    'RAG-PRIME-CREC',
    'raguife-prime-combo-crecimiento',
    'RAGUIFE PRIME COMBO CRECIMIENTO',
    'Raguife',
    (select id from public.categories where slug='perros'),
    'PERROS',
    'Referencia visual del diseño aprobado. Datos comerciales pendientes de verificación.',
    'Combo',
    0, 0, null, false, false, false, true, true
  ),
  (
    'RAN-757-SG',
    'ranger-757-sg',
    'RANGER 75,7 SG',
    null,
    (select id from public.categories where slug='campo'),
    'CAMPO',
    'Referencia visual del diseño aprobado. Ficha técnica y precio pendientes de verificación.',
    null,
    0, 0, null, false, true, false, false, true
  ),
  (
    'CIP-6-CALBOS',
    'cipermetrina-6-calbos',
    'CIPERMETRINA 6% CALBOS',
    'Calbos',
    (select id from public.categories where slug='campo'),
    'CAMPO',
    'Referencia visual del diseño aprobado. Ficha técnica y precio pendientes de verificación.',
    '6%',
    0, 0, null, false, true, false, false, true
  ),
  (
    'HIP-PAS-20',
    'hipofen-pasta-oral-20g',
    'HIPOFEN PASTA ORAL 20g',
    null,
    (select id from public.categories where slug='equinos'),
    'EQUINOS',
    'Referencia visual del diseño aprobado. Ficha técnica y precio pendientes de verificación.',
    '20 g',
    0, 0, null, false, true, false, false, true
  )
on conflict (sku) do update set
  name=excluded.name,
  brand=excluded.brand,
  category_id=excluded.category_id,
  description=excluded.description,
  package_size=excluded.package_size,
  price_pyg=excluded.price_pyg,
  regulated=excluded.regulated,
  active=excluded.active,
  verified=excluded.verified;
