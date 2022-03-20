import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { take } from 'rxjs';
import { Transaction } from 'src/app/core/models/transaction';
import { TransactionService } from 'src/app/core/services/transaction.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  historyForm: FormGroup = new FormGroup({
    period: new FormControl('')
  });

  transactions?: Transaction[];

  chartOption?: EChartsOption;

  constructor(public transactionService: TransactionService) { }

  ngOnInit(): void {
  }

  periodSelected(period: string): void {
    if (period == '') return;
    this.transactionService.getVariableTransactions(parseInt(period)).pipe(take(1)).subscribe(transactions => {
      this.transactions = transactions;
      this.buildChart();
    });
  }

  buildChart(): void {this.transactions?.forEach(transaction => console.log(transaction));
    
  }

}
