import { getOtherUserFromPrivateChat } from "@/helper";
import useCurrentUser from "@/hooks/use-current-user";
import { useInitials } from "@/hooks/use-initials";
import { Conversations, Image, Message } from "@/types/model";

const MessageRight = ({
    
    conversation, 
    message, 
    messages,
    messageGroup,
    groupIndex,
    index
    
    } : {
        
    conversation: Conversations, 
    message: Message, 
    messageGroup: Message[],
    messages: Message[][],
    groupIndex: number,
    index: number

    }) => {
    const otherUser = getOtherUserFromPrivateChat(conversation);
    const currentUser = useCurrentUser();
    const getInitials = useInitials();
    const showDP = () => {
        if(messageGroup?.[index+1]){
            const nextMessage = messageGroup[index+1]
            const allSeenUsers = nextMessage.message_seen
            for(let i = 0; i < allSeenUsers.length; i++){
                if(currentUser.id === allSeenUsers[i].id){
                    return 0;
                }
            }
            return 1
        } 
        if(groupIndex === (messages.length-1)){
            
        }
    }
    return (
        <>
            <div key={message.id} className="message-box">
                <span
                    className={`message message-right message flex flex-col items-end ${message.error ? 'bg-red-500' : 'bg-gray-800 dark:bg-gray-100'} text-white dark:text-gray-900 ${message.images ? 'gap-1.5' : ''}`}
                >
                    {message.images
                        ? message.images.map((image: Image) => <img key={image.id} src={`/message/image/${image.id}?preview=true`} />)
                        : null}
                    {message.message}
                </span>
                <span className="recipient-dp">
                    {otherUser.image ? (
                        <img src={`/${otherUser.image}`} style={{ opacity: showDP() }} alt="" />
                    ) : (
                        <div className="p flex items-center justify-center rounded-full bg-gray-200 text-[10px]">{getInitials(otherUser.name)}</div>
                    )}
                </span>
            </div>
            <div
                className={`bottom-0 left-0 mr-8 text-[10px] text-gray-500 ${index === messageGroup.length - 1 && messages.length - 1 === groupIndex ? 'block' : 'hidden'}`}
            >
                {message.created_at_human}
            </div>
            <div className="absolute bottom-0 left-0 w-full text-center text-[10px]">{message.created_at_human_24h}</div>
        </>
    );
};

export default MessageRight;
