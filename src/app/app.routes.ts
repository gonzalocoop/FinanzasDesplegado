import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { IniciosesionComponent } from './components/iniciosesion/iniciosesion.component';
import { RegistrarusuarioComponent } from './components/registrarusuario/registrarusuario.component';

import { Propiedad } from './components/propiedad/propiedad'; // LISTA
import { CrearpropiedadComponent } from './components/propiedad/crearpropiedad/crearpropiedad.component'; // FORMULARIO
import { CostosComponent } from './components/propiedad/costos/costos.component';
import { Creditomivivienda } from './components/creditomivivienda/creditomivivienda'; // LISTA
import { CrearcreditomiviviendaComponent } from './components/creditomivivienda/crearcreditomivivienda/crearcreditomivivienda.component'; // FORMULARIO
import { CreditoDetalleComponent } from './components/creditomivivienda/creditodetalle/creditodetalle.component';
import { seguridadGuard } from './guard/seguridad.guard'; 
import { Cronogramapagos } from './components/cronogramapagos/cronogramapagos'; 
import { PerfilComponent } from './components/perfil/perfil.component';
import { Reportes } from './components/reportes/reportes';
import { AnalisisRentabilidad } from './components/reportes/analisis-rentabilidad/analisis-rentabilidad';
import { CreditoPorUsuarioConPeriodoGracia } from './components/reportes/credito-por-usuario-con-periodo-gracia/credito-por-usuario-con-periodo-gracia';
import { PropiedadXUser } from './components/reportes/propiedad-xuser/propiedad-xuser';
import { PrecioCorrespondientePorPropiedadXUsuario1 } from './components/reportes/precio-correspondiente-por-propiedad-xusuario/precio-correspondiente-por-propiedad-xusuario';
import { Resumenfiancierousuario } from './components/reportes/resumenfiancierousuario/resumenfiancierousuario';
export const routes: Routes = [
    // --- Rutas Públicas ---
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
    { path: 'landing', component: LandingpageComponent },
    { path: 'iniciosesion', component: IniciosesionComponent },
    { path: 'registrarusuario', component: RegistrarusuarioComponent },

    // --- Rutas de USUARIO ---
    {
        path: 'homes', 
        component: HomeComponent,
        canActivate: [seguridadGuard] 
    },
    {
        path: 'perfil', 
        component: PerfilComponent, 
        canActivate: [seguridadGuard] 
    },
    {
        path:'seleccionar-propiedad',
        component: Propiedad, 
        canActivate: [seguridadGuard],
        data: { isUserFlow: true } 
    },
   {
    // Esta es la ruta a la que te lleva el botón "Seleccionar" de la lista
    path:'ingresar-costos/:idPropiedad', 
    component: CostosComponent, // <-- ¡AQUÍ USAMOS EL NUEVO COMPONENTE!
    canActivate: [seguridadGuard]
    // Ya no necesitamos 'data: { isUserFlow: true }' porque este componente es solo para eso.
},
    {
        path:'creditoMiVivienda',
        component: Creditomivivienda, 
        canActivate: [seguridadGuard] 
    },
    {
        path: 'creditoMiVivienda/nuevo/:idPrecioCorrespondiente', 
        component: CrearcreditomiviviendaComponent, 
        canActivate: [seguridadGuard],
        data: { isUserFlow: true }
    },
    {
        path: 'credito/:idCredito/cronograma', 
        component: Cronogramapagos, 
        canActivate: [seguridadGuard]
    },
    {
        path: 'credito/:idCredito/detalle', 
        component: CreditoDetalleComponent, 
        canActivate: [seguridadGuard]
    },
    
    {
        path: 'admin/propiedades', 
        component: Propiedad,
        canActivate: [seguridadGuard] 
    },
    {
        path: 'admin/propiedades/nueva', 
        component: CrearpropiedadComponent, 
        canActivate: [seguridadGuard]
    },
    {
        path: 'admin/propiedades/editar/:id', 
        component: CrearpropiedadComponent, 
        canActivate: [seguridadGuard]
    },
    {
        path: 'reportes', 
        component: Reportes,
        children:[
            {
                path:'analisisrentabilidad', component:AnalisisRentabilidad,
            },
            {
                path:'creditoPorusuarioconPeriodogracia', component:CreditoPorUsuarioConPeriodoGracia,
            },
            {
                path:'preciocorrespondienteporpropiedadxusuario', component:PrecioCorrespondientePorPropiedadXUsuario1,
            },
            {
                path:'propiedadxuser', component:PropiedadXUser,
            },
            {
                path:'resumenfinancierousuario/:id', component:Resumenfiancierousuario,
            }
           
        ],
        canActivate: [seguridadGuard]
    }
    
    
];