import { useEffect, useState } from 'react';
import { PageAgent } from 'page-agent';

export const usePageAgent = () => {
    const [pageAgent, setPageAgent] = useState<PageAgent>();

    useEffect(() => {
        const agent = new PageAgent({
            baseURL: 'https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run',
            apiKey: 'NA',
            model: 'qwen3.5-plus',
        });

        setPageAgent(agent);
    }, []);

    return pageAgent;
};
