import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="ticket-list-container">
      <h2>Tickets</h2>

      <div class="filters">
        <div class="filter-group">
          <label for="priority">Priority:</label>
          <select id="priority" [(ngModel)]="filter.priority" (change)="onFilter()">
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="status">Status:</label>
          <select id="status" [(ngModel)]="filter.status" (change)="onFilter()">
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Due Date Range:</label>
          <input type="date" [(ngModel)]="filter.dueDateStart" (change)="onFilter()">
          <input type="date" [(ngModel)]="filter.dueDateEnd" (change)="onFilter()">
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th (click)="onSort('title')">Title <i class="sort-icon">↕</i></th>
              <th>Description</th>
              <th (click)="onSort('priority')">Priority <i class="sort-icon">↕</i></th>
              <th (click)="onSort('status')">Status <i class="sort-icon">↕</i></th>
              <th (click)="onSort('dueDate')">Due Date <i class="sort-icon">↕</i></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ticket of tickets">
              <td>{{ ticket.title }}</td>
              <td>{{ ticket.description }}</td>
              <td>{{ ticket.priority }}</td>
              <td>{{ ticket.status }}</td>
              <td>{{ ticket.dueDate | date }}</td>
              <td>
                <a class="btn btn-edit" [routerLink]="['/tickets/edit', ticket._id]">Edit</a>
                <button class="btn btn-delete" (click)="deleteTicket(ticket._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button *ngFor="let page of [].constructor(totalPages); let i = index"
                (click)="onPageChange(i + 1)"
                [disabled]="currentPage === i + 1"
                [class.active]="currentPage === i + 1"
                class="btn btn-page">
          {{ i + 1 }}
        </button>
      </div>

      <a class="btn btn-submit" routerLink="/tickets/new">Create New Ticket</a>
    </div>
  `,
  styles: [`
    .ticket-list-container {
      padding: 2rem;
    }
    h2 {
      margin-bottom: 1rem;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
    }
    label {
      margin-bottom: 0.5rem;
    }
    select, input[type="date"] {
      padding: 0.5rem;
      background-color: #333;
      color: #fff;
      border: 1px solid #555;
      border-radius: 4px;
    }
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #444;
    }
    th {
      background-color: #2a2a2a;
      cursor: pointer;
    }
    th:hover {
      background-color: #3a3a3a;
    }
    .sort-icon {
      font-style: normal;
      margin-left: 0.5rem;
    }
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn-page {
      background-color: #333;
      color: #fff;
    }
    .btn-page:hover:not(:disabled) {
      background-color: #444;
    }
    .btn-page.active {
      background-color: #4CAF50;
    }
    .btn-page:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-edit {
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      margin-right: 0.5rem;
    }
    .btn-delete {
      background-color: #f44336;
      color: white;
    }
    .btn-create {
      display: inline-block;
      background-color: #2196F3;
      color: white;
      text-decoration: none;
    }
    .btn:hover {
      opacity: 0.8;
    }
  `]
})
export class TicketListComponent implements OnInit {
  tickets: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  sortField = '';
  sortDirection = '';
  filter: any = {};

  constructor(private ticketService: TicketService) { }

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    const sort = this.sortField ? `${this.sortField},${this.sortDirection}` : '';
    this.ticketService.getTickets(this.currentPage, this.pageSize, sort, this.filter)
      .subscribe(response => {
        this.tickets = response.tickets;
        this.totalPages = response.totalPages;
      });
  }

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadTickets();
  }

  onFilter() {
    this.currentPage = 1;
    this.loadTickets();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTickets();
  }

  deleteTicket(id: string) {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(id).subscribe(() => {
        this.loadTickets();
      });
    }
  }
}