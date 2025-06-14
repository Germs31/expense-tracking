import React from 'react'

interface ICard  {
  title: string | "Debit"
  total: number | 1000
}

const Card = (props: ICard) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };
  
  return (
    <div className="rounded-2xl bg-neutral-800 shadow-md min-w-20 min-h-28 flex flex-col justify-center items-start p-8 transition hover:bg-neutral-700 border-t-2 border-green-500 hover:border-green-400 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
      <div className="text-sm text-neutral-400 uppercase tracking-wider mb-1 font-medium">{props.title}</div>
      <div className="text-3xl text-white font-bold">{formatNumber(props.total)}</div>
    </div>
  )
}

export default Card