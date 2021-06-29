import MultiSelectDropdown from "./components/MultiSelectDropdown";
import { QueryClientProvider, QueryClient } from 'react-query';

export default function App() {

    const queryClient = new QueryClient()

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <div style={{ width: 800 }}>
                    <MultiSelectDropdown />
                </div>
            </QueryClientProvider>
        </>
    )
}
