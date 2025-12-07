const domain = "meet.jit.si";

const options = {
    roomName: "my_meeting_room",  // ← اكتب اسم الغرفة هنا يدويًا
    parentNode: document.querySelector('#jitsi'),
    userInfo: { 
        displayName: "ضيف"  // ← اسم المستخدم ثابت بدون Django
    },
    configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
    },
    interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
    }
};

if (typeof JitsiMeetExternalAPI !== 'undefined') {
    const api = new JitsiMeetExternalAPI(domain, options);
}

