import { User } from "@/types/model"
import { usePage } from "@inertiajs/react"

type AuthProps = {
    auth: {
        user: User
    }
}

const useCurrentUser = () => {
    const page = usePage<{ props: AuthProps }>()
    const auth = page.props?.auth as AuthProps['auth']
    return auth?.user
}

export default useCurrentUser