import { NgModule } from '@angular/core';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FlexLayoutModule } from 'ngx-flexible-layout';

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
