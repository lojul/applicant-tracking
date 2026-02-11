export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Applicant Tracking System API</h1>
      <h2>Endpoints:</h2>
      <ul>
        <li>GET /api/applicants - List all applicants</li>
        <li>POST /api/applicants - Create applicant</li>
        <li>GET /api/applicants/:id - Get applicant</li>
        <li>PUT /api/applicants/:id - Update applicant</li>
        <li>DELETE /api/applicants/:id - Delete applicant</li>
      </ul>
    </main>
  );
}
