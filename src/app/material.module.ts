import { NgModule } from '@angular/core';

import {
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    MatDividerModule,
    MatExpansionModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatProgressBarModule,
        FlexLayoutModule,
        MatDividerModule,
        MatExpansionModule,
        MatSelectModule,
        MatChipsModule,
        MatAutocompleteModule
    ],
    exports: [
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatProgressBarModule,
        FlexLayoutModule,
        MatDividerModule,
        MatExpansionModule,
        MatSelectModule,
        MatChipsModule,
        MatAutocompleteModule
    ]
})
export class MaterialModule { }
