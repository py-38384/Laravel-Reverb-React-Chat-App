<link href='https://cdn.boxicons.com/fonts/basic/boxicons.min.css' rel='stylesheet'>
@section('css')
<style>
    :root {
        --button-and-border-color: #898989;
        --button-hover-color: rgb(243 243 243);
        --primary-btn-color-light: #262626; 
    }



    /* For chat left message */
    .chat-left-message-light{
        background-color: rgb(237 237 237);
    }
    .chat-left-message-dark{
        background-color: #171717;
        color: rgb(237 237 237);
    }
    /* For chat right message */
    .chat-right-message-light{
        color: white;
        background-color: #262626;
    }
    .chat-right-message-dark{
        color: #262626;
        background-color: white;
    }
    /* For chat header */
    .chat-header-light{
        border: 1px solid var(--button-and-border-color);
    }
    .chat-header-dark{
        box-shadow: 0px 0px 2px var(--button-and-border-color);
    }
    /* For back button and info button hover effect */
    .chat-header-buttons-hover-light{
        background-color: rgb(243 243 243);
    }
    .chat-header-buttons-hover-dark{
        background-color: #171717;
    }
    /* For message input box */
    .message-input-box-light{
        background: var(--button-hover-color);
    }
    .message-input-box-dark{
        box-shadow: 0px 0px 2px var(--button-hover-color);
    }
    .message-input-box-focus-light{
        background: rgb(255 255 255);
        box-shadow: 0px 0px 2px rgb(201 201 201);
    }
    .message-input-box-focus-dark{
        background: #171717;
    }
    /* For image upload button and send button */
    .upload-send-button-light{
        color: var(--primary-btn-color-light);
    }
    .upload-send-button-dark{
        color: var(--button-and-border-color);
    }
    .upload-send-button-hover-light{
        background-color: var(--button-hover-color);
    }
    .upload-send-button-hover-dark{
        background-color: #171717;
    }


    
    .dp-container img {
        width: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

    .recipient-dp img {
        width: 25px;
        border-radius: 50%;
        object-fit: cover;
    }

    .chat-container {
        display: flex;
        flex-direction: column;
        padding-top: 30px;
        max-height: 78vh;
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
        gap: 10px;
    }

    .chat-container::-webkit-scrollbar {
        display: none;
    }

    .message-container {
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding-bottom: 8px;
    }

    .message-container .message {
        padding: 5px;
        width: fit-content;
    }

    .chat-container .chat {
        display: flex;
        align-items: end;
        gap: 10px;
    }

    .chat-container .chat-left .message:first-child {
        border-top-left-radius: 10px;
    }

    .chat-container .chat-left .message {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    .chat-container .chat-left .message:last-child {
        border-bottom-left-radius: 10px;
        0;
    }

    .chat-container .chat-right .message-box:first-child .message {
        border-top-right-radius: 10px;
    }

    .chat-container .chat-right .message-box .message {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    .chat-container .chat-right .message-box:last-child .message {
        border-bottom-right-radius: 10px;
    }

    .chat-container .chat-right {
        justify-content: end;
        flex-direction: row-reverse;
    }

    .chat .message {
        max-width: 400px;
    }

    .message-box {
        display: flex;
        align-items: end;
        gap: 2px;
    }

    .message-box:last-child .message-right {
        display: block;
        margin-bottom: 30px;
    }

    .recipient-header-dp img {
        width: 45px;
        border-radius: 50%;
        object-fit: cover;
    }

    .chat-header {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-radius: 5px;
    }

    .chat-header-left {
        display: flex;
        gap: 10px;
    }

    .recipient-dp-header-and-idicator {
        display: flex;
        gap: 20px;
    }

    .recipient-dp-header-and-idicator .idicator {
        display: flex;
        justify-content: space-between;
        gap: 6px;
        align-items: center;
        width: fit-content;
        font-size: 13px;
    }

    .recipient-dp-header-and-idicator .idicator .idicator-icon {
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-bottom: 1px;
    }

    .back-button-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .back-button {
        font-size: 30px;
        color: var(--button-and-border-color);
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 15px;
    }

    .chat-header .info-container .info-icon {
        font-size: 15px;
        display: block;
        width: 25px;
        height: 25px;
        color: var(--button-and-border-color);
        border: 2px solid var(--button-and-border-color);
        text-align: center;
        border-radius: 50%;
        font-weight: 900;
    }

    .chat-header .info-container .info {
        padding: 10px;
    }

    .chat-header .info-container .info:hover {
        cursor: pointer;
        border-radius: 50%;
    }

    .recipient-name {
        font-size: 17px;
    }

    .name-and-idicator {
        display: flex;
        align-content: center;
        justify-content: center;
        flex-direction: column;
    }
    .chat-sendbox{
        display: flex;
        width: 100%;
        padding-top: 10px;
        gap: 5px;
    }
    .chat-sendbox > *{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .message-box-container{
        flex: 1;
    }
    .message-input-box{
        width: 100%;
        padding: 5px 15px;
        resize: none;
        outline: none;
        height: 35px;
        border-radius: 20px;
    }
    .image-file,
    .send-button-container button{
        font-size: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 50%;
    }
    @media screen and (max-width: 1023px) {
        .chat-container {
            max-height: 73vh;
        }
    }
    @media screen and (max-width: 800px) {
        .chat-container {
            max-height: 72vh;
        }
        .chat .message {
            max-width: 300px;
        }
        .dp-container img {
            width: 30px;
        }
        .recipient-dp img {
            width: 20px;
        }
        .chat-container .chat .message {
            font-size: 14px;
        }
    }
    @media screen and (max-width: 500px) {
        .chat .message {
            max-width: 240px;
            line-height: 25px;
            padding: 10px;
        }
        .dp-container img {
            width: 30px;
        }
        .recipient-dp img {
            width: 20px;
        }
        .chat-container .chat .message {
            font-size: 14px;
        }
        .message-input-box{
           font-size: 15px;
        }
    }
    @media screen and (max-height: 800px) {
        .chat-container {
            max-height: 70vh;
        }
    }
    @media screen and (max-height: 750px) {
        .chat-container {
            max-height: 67vh;
        }
    }
    @media screen and (max-height: 700px) {
        .chat-container {
            max-height: 65vh;
        }
    }
</style>
@endsection

<div>
    <div class="chat-header"
    data-appearance="appearance"
    data-light-mode-class="chat-header-light"
    data-dark-mode-class="chat-header-dark"
    >
        <div class="chat-header-left">
            <div class="back-button-container">
                <a href="" class="back-button"
                data-hover-appearance="appearance"
                data-light-mode-hover-class="chat-header-buttons-hover-light"
                data-dark-mode-hover-class="chat-header-buttons-hover-dark"
                ><i class='bx  bx-chevron-left'></i></a>
            </div>
            <div class="recipient-dp-header-and-idicator">
                <div class="recipient-header-dp">
                    <img src="{{ asset('assets/images/onika.jpg') }}" alt="">
                </div>
                <div class="name-and-idicator">
                    <h4 class="text-2xl font-extrabold recipient-name">{{ $user->name }}</h4>
                    <div class="idicator"><span class="idicator-icon" style="background-color: lime;"></span>Online
                    </div>
                </div>
            </div>
        </div>
        <div class="info-container">
            <span class="info"
            data-hover-appearance="appearance"
            data-light-mode-hover-class="chat-header-buttons-hover-light"
            data-dark-mode-hover-class="chat-header-buttons-hover-dark"
            >
                <span class="info-icon">
                    i
                </span>
            </span>
        </div>
    </div>
    <div class="chat-container">
        <div class="chat chat-left">
            <div class="dp-container"><img src="{{ asset('assets/images/onika.jpg') }}" class="w-[100px]" alt=""></div>
            <div class="message-container">
                <div class="message"
                data-appearance="appearance"
                data-light-mode-class="chat-left-message-light"
                data-dark-mode-class="chat-left-message-dark"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                <div class="message"
                data-appearance="appearance"
                data-light-mode-class="chat-left-message-light"
                data-dark-mode-class="chat-left-message-dark"
                >Lorem ipsum</div>
            </div>
        </div>
        <div class="chat chat-right">
            <div class="message-container">
                <div class="message-box">
                    <span class="message message-right"
                    data-appearance="appearance"
                    data-light-mode-class="chat-right-message-light"
                    data-dark-mode-class="chat-right-message-dark"
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </span>
                    <span class="recipient-dp" style="display:none;"><img src="{{ asset('assets/images/onika.jpg') }}"
                            alt=""></span>
                </div>
                <div class="message-box">
                    <span class="message message-right"
                    data-appearance="appearance"
                    data-light-mode-class="chat-right-message-light"
                    data-dark-mode-class="chat-right-message-dark"
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur
                        adipisicing elit. Distinctio aliquam natus consequatur tenetur ab et est repellat, nesciunt sint
                        libero, amet nam facere. Quis, atque odio. Dolorem vitae fugit harum.
                    </span>
                    <span class="recipient-dp" style="display:none;"><img src="{{ asset('assets/images/onika.jpg') }}"
                            alt=""></span>
                </div>
                <div class="message-box">
                    <span class="message message-right"
                    data-appearance="appearance"
                    data-light-mode-class="chat-right-message-light"
                    data-dark-mode-class="chat-right-message-dark"
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </span>
                    <span class="recipient-dp"><img src="{{ asset('assets/images/onika.jpg') }}" alt=""></span>
                </div>
            </div>
        </div>
        <div class="chat chat-left">
            <div class="dp-container"><img src="{{ asset('assets/images/onika.jpg') }}" class="w-[100px]" alt=""></div>
            <div class="message-container">
                <div class="message"
                data-appearance="appearance"
                data-light-mode-class="chat-left-message-light"
                data-dark-mode-class="chat-left-message-dark"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                <div class="message"
                data-appearance="appearance"
                data-light-mode-class="chat-left-message-light"
                data-dark-mode-class="chat-left-message-dark"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus
                    ea ab quaerat minima ullam ipsam dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam
                    sint ut sequi expedita vitae.</div>
                <div class="message"
                data-appearance="appearance"
                data-light-mode-class="chat-left-message-light"
                data-dark-mode-class="chat-left-message-dark"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus
                    ea ab quaerat minima ullam ipsam dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam
                    sint ut sequi expedita vitae.</div>
                <div class="message"
                data-appearance="appearance"
                data-light-mode-class="chat-left-message-light"
                data-dark-mode-class="chat-left-message-dark"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus
                    ea ab quaerat minima ullam ipsam dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam
                    sint ut sequi expedita vitae.</div>
                <div class="message"
                data-appearance="appearance"
                data-light-mode-class="chat-left-message-light"
                data-dark-mode-class="chat-left-message-dark"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus
                    ea ab quaerat minima ullam ipsam dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam
                    sint ut sequi expedita vitae.</div>
            </div>
        </div>
    </div>
    <form wire:submit="submit" class="chat-sendbox">
        <div class="image-file-container">
            <label for="image-file" class="image-file" 
            data-appearance="appearance"
            data-light-mode-class="upload-send-button-light"
            data-dark-mode-class="upload-send-button-dark"

            data-hover-appearance="appearance"
            data-light-mode-hover-class="upload-send-button-hover-light"
            data-dark-mode-hover-class="upload-send-button-hover-dark"
            >
                <i class='bx  bx-image-landscape'></i>
            </label>
            <input style="display: none;" id="image-file" type="file">
        </div>
        <div class="message-box-container">
            <textarea 
                name="message" 
                placeholder="Write your message..." 
                id="" 
                class="message-input-box"

                data-appearance="appearance"
                data-light-mode-class="message-input-box-light"
                data-dark-mode-class="message-input-box-dark"

                data-focus-appearance="appearance"
                data-light-mode-focus-class="message-input-box-focus-light"
                data-dark-mode-focus-class="message-input-box-focus-dark"
            ></textarea>
        </div>
        <div class="send-button-container">
            <button
                data-appearance="appearance"
                data-light-mode-class="upload-send-button-light"
                data-dark-mode-class="upload-send-button-dark"

                data-hover-appearance="appearance"
                data-light-mode-hover-class="upload-send-button-hover-light"
                data-dark-mode-hover-class="upload-send-button-hover-dark"
            ><i class='bx  bx-send-alt'></i></button>
        </div>
    </form>
</div>