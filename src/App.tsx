import { Router } from '@/router';
import { ThemeProvider } from '@/providers/ThemeProvider';

const App = () => {
    return (
        <ThemeProvider>
            <Router />
        </ThemeProvider>
    );
};

export default App;
