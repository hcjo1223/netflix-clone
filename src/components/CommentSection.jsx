import { useEffect, useState } from 'react';
import { db, ref, push, onValue, remove } from '../firebase';


const CommentSection = ({ movieId }) => {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);


    useEffect(() => {
        const commentsRef = ref(db, `comments/${movieId}`);
        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            const loaded = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
            setComments(loaded);
        });
    }, [movieId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nickname.trim() || !password.trim() || !comment.trim()) return;

        await push(ref(db, `comments/${movieId}`), {
            nickname,
            password,
            content: comment,
            createdAt: new Date().toLocaleString(),
        });

        setNickname('');
        setPassword('');
        setComment('');
    };


    const handleDelete = (id, passwordInput) => {
        const target = comments.find((c) => c.id === id);
        if (target.password === passwordInput) {
            remove(ref(db, `comments/${movieId}/${id}`));
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

  return (
    <div className="px-64 mb-32">
      <h3 className="text-xl font-bold mb-3">💬 댓글</h3>
      <form onSubmit={handleSubmit} className="space-y-2 mb-2">
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-1/4 p-2 rounded bg-gray-700 text-white placeholder-gray-300"
            placeholder="닉네임"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-1/4 p-2 rounded bg-gray-700 text-white placeholder-gray-300"
            placeholder="비밀번호"
          />
        </div>
        <div className="flex gap-3">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-300"
            placeholder="댓글을 입력하세요"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white font-semibold">등록</button>
        </div>
      </form>

      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="bg-gray-500 p-4 rounded shadow text-sm text-white">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-white">{c.nickname}</span>
              <span className="text-xs text-gray-400">{c.createdAt}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-100">{c.content}</p>
            <button
            onClick={() => {
                const pwd = prompt('댓글 삭제를 위해 비밀번호를 입력하세요');
                handleDelete(c.id, pwd);
            }}
            className="text-xs text-red-400 hover:underline"
            >
            삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;