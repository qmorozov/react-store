import { createContext } from 'react';
import type { ProductFilter } from '../models/filter/product.filter';

const FilterContext = createContext<ProductFilter>(null);

export default FilterContext;
