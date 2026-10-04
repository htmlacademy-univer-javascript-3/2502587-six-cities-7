import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <div style={{ textAlign: 'center', paddingTop: '80px' }}>
      <h1>404 Not Found</h1>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}

export default NotFoundPage;
