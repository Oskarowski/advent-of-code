Bun.serve({
    fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        if (path === '/trie.json') {
            return new Response(Bun.file('trie.json'));
        }

        return new Response(Bun.file('index.html'));
    },
    port: 3000,
});
