import { style, animate, transition, query, stagger, AnimationTransitionMetadata } from '@angular/animations';

export const ScaleInOut: AnimationTransitionMetadata[] = [
    transition('* => *', [
        query(':leave', [
            stagger(100, [
                animate('0.2s', style({ transform: 'scale(0)', opacity: 0 }))
            ])
        ], { optional: true }),
        query(':enter', [
            style({ transform: 'scale(0.5)', opacity: 0.1 }),
            stagger(100, [
                animate('0.2s', style({ transform: 'scale(1)', opacity: 1 }))
            ])
        ], { optional: true })
    ])
];
