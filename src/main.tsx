import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@/style/index.css';

import CircleLoading from '@/components/loading/CircleLoading';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense fallback={<CircleLoading />}>
            <App />
        </Suspense>
    </React.StrictMode>,
);
