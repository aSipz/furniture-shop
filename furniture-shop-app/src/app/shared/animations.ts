import { trigger, animateChild, group, transition, animate, style, query } from '@angular/animations';

export const slideInAnimation =
    trigger('routeAnimations', [
        // transition('* <=> *', [
        //     style({ position: 'relative' }),
        //     query(':enter, :leave', [
        //         style({
        //             position: 'absolute',
        //             top: 0,
        //             left: 0,
        //             width: '100%'
        //         })
        //     ]),
        //     query(':enter', [
        //         style({ left: '-100%' })
        //     ]),
        //     query(':leave', animateChild()),
        //     group([
        //         query(':leave', [
        //             animate('200ms ease-out', style({ left: '100%', opacity: 0 }))
        //         ]),
        //         query(':enter', [
        //             animate('300ms ease-out', style({ left: '0%' }))
        //         ]),
        //         query('@*', animateChild(), { optional: true })
        //     ]),
        // ]),
        transition('* <=> *', [
            query(':enter, :leave', 
                 style({ position: 'fixed',  width: '100%', 'z-index': -10 }), 
                 { optional: true }),
            group([
                 query(':enter', [
                     style({ transform: 'translateY(-100%)' }), 
                     animate('1s ease-in-out', 
                     style({ transform: 'translateY(0%)' }))
                 ], { optional: true }),
                 query(':leave', [
                     style({ transform: 'translateY(0%)' }),
                     animate('1s ease-in-out', 
                     style({ transform: 'translateY(200%)' }))
                     ], { optional: true }),
             ])
       ]),
    ]);