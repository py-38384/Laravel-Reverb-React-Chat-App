import { User } from "./model"

export interface NavLink{
    active: boolean,
    label: string,
    url: string | null,
}
export interface UserPaginate{
    current_page: number,
    data: User[],
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: NavLink[],
    next_page_url: string,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number,
}