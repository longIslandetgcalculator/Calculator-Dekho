<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>All-In-One Calculator Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f0f9ff',
                100: '#e0f2fe',
                500: '#0ea5e9',
                600: '#0284c7',
                700: '#0369a1',
              },
              dark: {
                bg: '#0f172a',
                surface: '#1e293b',
              }
            },
            animation: {
              'press': 'press 0.1s ease-in-out',
            },
            keyframes: {
              press: {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(0.95)' },
              }
            }
          }
        }
      }
    </script>
    <style>
      /* Hide scrollbar for Chrome, Safari and Opera */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      /* Hide scrollbar for IE, Edge and Firefox */
      .no-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    </style>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "react-router-dom": "https://esm.sh/react-router-dom@6.22.3?deps=react@18.2.0,react-dom@18.2.0",
    "lucide-react": "https://esm.sh/lucide-react@0.263.1",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "react/": "https://esm.sh/react@^19.2.3/"
  }
}
</script>
  </head>
  <body class="bg-gray-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-200">
    <div id="root"></div>
  </body>
</html>
