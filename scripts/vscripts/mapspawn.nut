if (!("Entities" in this)) return; // Quit if the script is being loaded client-side
IncludeScript("ppmod"); // Include ppmod as early as possible

::sendResponse <- function (content, type = "text/html") {
    local lines = 0;
    for (local i = 0; i < content.len(); i ++) {
        if (content[i] == '\n') lines ++;
    }
    local contentLength = content.len() + lines;

    printl("HTTP/1.1 200 OK");
    printl("Content-Type: "+ type +"; charset=utf-8");
    printl("Content-Length: " + contentLength);
    printl("");
    for (local i = 0; i < content.len(); i += 128) {
        local end = min(i + 128, content.len());
        print(content.slice(i, end));
    }
};

::pplayer <- null;

ppmod.onauto(async(function () {
    ::pplayer = ppmod.player(GetPlayer());
    yield ::pplayer.init();

    // Routes/controllers
    // Because we can not map url endpoints to commands in game, we use custom HTTP methods for each
    SendToConsole(@"alias GET ""script_execute pages/index""");
    SendToConsole(@"alias Entities ""script_execute controllers/entities""");
    SendToConsole(@"alias MapName ""script_execute controllers/mapname""");
    SendToConsole(@"alias TopDown ""script_execute controllers/topdown""");
}));
