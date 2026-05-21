import { Button, ButtonGroup } from '@mui/material';

import type { AuthTab } from '@/types/auth/AuthTabs';

type AuthTabsProps = {
    activeTab: AuthTab;
    changeActiveTab: (tabValue: AuthTab) => void;
};

export const AuthTabs = ({ activeTab, changeActiveTab }: AuthTabsProps) => {
    return (
        <ButtonGroup fullWidth size="large" variant="outlined" aria-label="Auth button group">
            <Button
                variant={activeTab === 'signIn' ? 'contained' : 'outlined'}
                onClick={() => changeActiveTab('signIn')}
            >
                Авторизация
            </Button>
            <Button
                variant={activeTab === 'signUp' ? 'contained' : 'outlined'}
                onClick={() => changeActiveTab('signUp')}
            >
                Регистрация
            </Button>
        </ButtonGroup>
    );
};
