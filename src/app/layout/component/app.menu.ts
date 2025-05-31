import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Main Menu',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/Gescom/frontOffice/Dashboards'] },
                    { label: 'Contactes', icon: 'pi pi-fw pi-users', items: [
                        {
                            label: 'Employées',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/Gescom/frontOffice/User']
                        },
                        {
                            label: ' Clients',
                            icon: 'pi pi-fw pi-address-book',
                            routerLink: ['/Gescom/frontOffice/User/client']
                        },
                        {
                            label: ' Fournisseurs',
                            icon: 'pi pi-fw pi-truck',
                            routerLink: ['/Gescom/frontOffice/User/supplier']
                        }
                    ] },
                    { label: 'Achats', icon: 'pi pi-fw pi-dollar', items: [
                        {
                            label: 'Bon d"entrée ',
                            icon: 'pi pi-fw pi-shopping-cart',
                            routerLink: ['/Gescom/frontOffice/Achat/BonDentree']
                        },
                        {
                            label: 'Commande Fournisseur ',
                            icon: 'pi pi-fw pi-check-square',
                            routerLink: ['/Gescom/frontOffice/Achat/Commande']
                        }
                    ] },
                    { label: 'Vente', icon: 'pi pi-fw pi-money-bill', class: 'rotated-icon', items: [
                        {
                            label: 'Devis',
                            icon: 'pi pi-fw pi-file-edit',
                            routerLink: ['/Gescom/frontOffice/Sale/devis']
                        },
                        {
                            label: 'Bon de Livraison',
                            icon: 'pi pi-fw pi-truck',
                            routerLink: ['/Gescom/frontOffice/Sale/livraison']
                        },
                        {
                            label: 'Bon De Sortie',
                            icon: 'pi pi-fw pi-file-pdf',
                            routerLink: ['/Gescom/frontOffice/Sale/facture']
                        }
                    ] },

                    { label: 'Stock', icon: 'pi pi-fw pi-box', class: 'rotated-icon',
                        routerLink: ['/Gescom/frontOffice/Stock'],
                        items: [
                        {
                            label: 'Gestion de stock',
                            icon: 'pi pi-fw pi-box',
                            routerLink: ['/Gescom/frontOffice/Stock/StockManagement']
                        },
                        {
                            label: 'Liste Articles',
                            icon: 'pi pi-fw pi-list',
                            routerLink: ['/Gescom/frontOffice/Stock/ArticleListe']
                        },
                        {
                            label: 'Seuil de Stock',
                            icon: 'pi pi-fw pi-exclamation-circle',
                            routerLink: ['/Gescom/frontOffice/Stock/Seuil']
                        },
                        {
                            label: 'Bon De Trasnfert',
                            icon: 'pi pi-fw pi-arrows-h',
                            routerLink: ['/Gescom/frontOffice/Stock/BonDeTransfert']
                        }
                    ] }

                ]
                


            },
            {
                label: 'Settings',
                items: [
                    //{ label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                   // { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                   // { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                    //{ label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                   // { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                   // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                   // { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    //{ label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                   // { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                   // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    //{ label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    //{ label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    //{ label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Rapports', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/Gescom/frontOffice/Rapports'] },
                    { label: 'Paramétre', icon: 'pi pi-fw pi-cog', routerLink: ['/'] }
                ]
            },
            /*{
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },*/
            {
                label: 'More',
                items: [
                    {
                        label: 'Aide',
                        icon: 'pi pi-fw pi-question-circle',
                        routerLink: ['/']
                    },
                    {
                        label: 'Log out',
                        icon: 'pi pi-fw pi-sign-out',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
