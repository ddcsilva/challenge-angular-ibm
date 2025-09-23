import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteConfirmationData {
  title: string;
  message: string;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'ibm-delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="delete-confirmation-dialog">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>

      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
        @if (data.itemName) {
          <div class="item-highlight">
            <strong>"{{ data.itemName }}"</strong>
          </div>
        }
        <p class="warning-text">Esta ação não pode ser desfeita.</p>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          {{ data.cancelButtonText || 'Cancelar' }}
        </button>

        <button mat-raised-button color="warn" (click)="onConfirm()" class="confirm-button">
          <mat-icon>delete</mat-icon>
          {{ data.confirmButtonText || 'Excluir' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .delete-confirmation-dialog {
        min-width: 400px;
        max-width: 500px;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .warning-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        color: #f59e0b;
      }

      .dialog-content {
        margin: 1rem 0;
      }

      .item-highlight {
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 0.75rem;
        margin: 1rem 0;
        text-align: center;
      }

      .warning-text {
        color: #dc2626;
        font-weight: 500;
        font-size: 0.9rem;
        margin-top: 1rem;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding-top: 1rem;
      }

      .cancel-button {
        min-width: 100px;
      }

      .confirm-button {
        min-width: 120px;
      }

      @media (max-width: 480px) {
        .delete-confirmation-dialog {
          min-width: 300px;
        }

        .dialog-actions {
          flex-direction: column;

          button {
            width: 100%;
            margin: 0 !important;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmationData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
