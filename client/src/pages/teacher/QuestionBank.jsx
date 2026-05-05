import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  FileDown, 
  FileUp,
  Tag
} from 'lucide-react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender,
  getPaginationRowModel
} from '@tanstack/react-table';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('/questions');
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const columns = [
    {
      header: 'Question',
      accessorKey: 'questionText',
      cell: info => (
        <div className="max-w-md truncate font-medium text-slate-900">
          {info.getValue()}
        </div>
      )
    },
    {
      header: 'Subject',
      accessorKey: 'subject.name',
      cell: info => (
        <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-500">
          {info.getValue()}
        </span>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: info => (
        <span className="capitalize text-sm text-slate-600">{info.getValue()}</span>
      )
    },
    {
      header: 'Difficulty',
      accessorKey: 'difficulty',
      cell: info => {
        const diff = info.getValue();
        const colors = {
          easy: 'text-success',
          medium: 'text-warning',
          hard: 'text-danger'
        };
        return <span className={`capitalize font-bold text-xs ${colors[diff]}`}>{diff}</span>;
      }
    },
    {
      header: 'Marks',
      accessorKey: 'marks',
      cell: info => <span className="font-bold">{info.getValue()}</span>
    }
  ];

  const table = useReactTable({
    data: questions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Question Bank</h1>
        <div className="flex items-center gap-3">
          <button className="btn bg-white border border-slate-200 text-slate-600">
            <FileUp size={18} />
            Bulk Import
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            New Question
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search questions..." 
                className="input-field pl-10 h-10 text-sm"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white bg-slate-50 transition-all text-slate-500">
              <Filter size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <FileDown size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <th key={cell.id} className="px-6 py-4 font-normal">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn btn-outline py-1 px-3 text-xs"
            >
              Previous
            </button>
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn btn-outline py-1 px-3 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
