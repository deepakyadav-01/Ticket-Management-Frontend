import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="ticket-form-container">
      <div class="card ticket-form-card">
        <h2>{{ isEditMode ? 'Edit Ticket' : 'Create New Ticket' }}</h2>
        <form [formGroup]="ticketForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" formControlName="title" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" formControlName="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="priority">Priority:</label>
            <select id="priority" formControlName="priority" required>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
          </div>
          <div class="form-group">
            <label for="status">Status:</label>
            <select id="status" formControlName="status" required>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="dueDate">Due Date:</label>
            <input type="date" id="dueDate" formControlName="dueDate" required>
          </div>
          <button class="btn btn-submit" type="submit" [disabled]="!ticketForm.valid">
            {{ isEditMode ? 'Update Ticket' : 'Create Ticket' }}
          </button>
        </form>
        <a class="back-link" routerLink="/tickets">Back to Ticket List</a>
      </div>
    </div>
  `,
  styles: [`
   .ticket-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
}

.ticket-form-card {
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #fff;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  height: 100px;
  resize: vertical;
}

.btn-submit {
  width: 100%;
  margin-top: 1rem;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #4CAF50;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
  `]
})
export class TicketFormComponent implements OnInit {
  ticketForm: FormGroup;
  isEditMode = false;
  ticketId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ticketForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    if (this.ticketId) {
      this.isEditMode = true;
      this.loadTicket(this.ticketId);
    }
  }

  loadTicket(id: string) {
    this.ticketService.getTicket(id).subscribe(ticket => {
      this.ticketForm.patchValue(ticket);
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      if (this.isEditMode && this.ticketId) {
        this.ticketService.updateTicket(this.ticketId, this.ticketForm.value).subscribe(() => {
          this.router.navigate(['/tickets']);
        });
      } else {
        this.ticketService.createTicket(this.ticketForm.value).subscribe(() => {
          this.router.navigate(['/tickets']);
        });
      }
    }
  }
}