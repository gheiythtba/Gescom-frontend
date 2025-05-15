import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { SelectCompanyComponent } from './app/front_office/select-company/select-company.component';

export const appRoutes: Routes = [
    {
        path: 'Gescom',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'dashboard', component: Dashboard },

            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'frontOffice', loadChildren: () => import('./app/front_office/front-office.module').then(m => m.FrontOfficeModule) },

        ]
    },
    { path: 'SelectCompany', component: SelectCompanyComponent },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
