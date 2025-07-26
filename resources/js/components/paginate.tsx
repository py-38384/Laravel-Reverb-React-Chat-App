import { Paginate as PaginateInterface } from '@/types/paginate'

const Paginate = ({data}: {data:PaginateInterface}) => {
  return (
    <div className='flex gap-1 p-1'>
        {data.links.map((link, index) => (
            <a key={index} href={link.url ?? undefined} dangerouslySetInnerHTML={{ __html: link.label }} className={`p-2 h-[30px] border flex items-center justify-center hover:bg-gray-900 hover:text-white cursor-pointer ${link.active || ((data.current_page == 1) && index == 0) || ((data.current_page == (data.links.length - 2)) && index == (data.links.length - 1))? 'bg-gray-200 pointer-events-none': ''}`}></a>
        ))}
    </div>
  )
}

export default Paginate