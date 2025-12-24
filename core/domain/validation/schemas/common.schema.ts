import * as z from 'zod';

import { messages } from '../messages';

export const IdSchema = z.uuid(messages.INVALID_UUID);
