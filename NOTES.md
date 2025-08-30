# SupplySight Dashboard - Project Notes

## Decisions & Trade-offs

* **Initial Setup & Tooling**: I chose to build the project using **Vite + React** for its fast development server and simple setup. For styling, I used **Tailwind CSS** as required by the assignment, which was great for quickly building a modern UI.
* **GraphQL Client**: I initially started with Apollo Client but ran into persistent environment-specific import errors. To overcome this and complete the assignment, I switched to **urql**. It's a lightweight and powerful alternative that resolved the blocking issues. This was a significant trade-off to ensure project completion.
* **State Management**: For this application's scope, I used React's built-in hooks (`useState`, `useMemo`) for all state management. This includes handling filter state, the selected product for the drawer, and pagination. This approach is lightweight and avoids the need for a larger state management library like Redux.
* **Mutations & UI Updates**: After a mutation (like updating demand), the UI is automatically refreshed by re-executing the main products query. This provides immediate feedback to the user and was simpler to implement than managing a normalized cache.

## Potential Improvements

If I had more time, I would focus on the following:

* **Normalized Caching**: Instead of simply refetching the main query after a mutation, I would configure `urql`'s normalized cache. This would allow the UI to update instantly and optimistically without a network request, making the application feel faster.
* **Component Structure**: I would break down larger components like `App.jsx` into smaller, more focused components to improve readability and maintainability, for instance by creating a dedicated `Dashboard` component to hold the main layout.
* **Error Handling**: I would implement more user-friendly error handling, such as showing toast notifications for failed mutations instead of just logging to the console.
* **Loading States**: I would add more granular loading states, like skeleton loaders for the table and chart, to improve the perceived performance and user experience while data is being fetched.
* **Transfer Stock UI**: In the "Transfer Stock" form, the destination warehouse is hardcoded. I would replace this with a dropdown populated with other available warehouses.