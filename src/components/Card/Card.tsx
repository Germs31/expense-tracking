import React from 'react'

interface ICard  {
  title: string | "Debit"
  total: number | 1000
}
const Card = (props: ICard) => {
  return (
    <div className="rounded-2xl bg-neutral-700 min-w-20 min-h-28 flex flex-col justify-center items-start p-8">
      <div className="text-3xl text-white mb-2.5">{props.title.toLocaleUpperCase()}</div>
      <div className="text-2xl text-white">{props.total}</div>
    </div>
  )
}

export default Card