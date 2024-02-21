import Sqlite3 from 'sqlite3';
// const sqlite3 = require('sqlite3').verbose();

export async function createSQLite(app: App) {
  console.log(app);

  // 调用 .verbose() 方法，它会使 SQLite3 在运行时输出详细的调试信息，包括 SQL 语句的执行情况、错误信息等。
  const sqlite3 = Sqlite3.verbose();

  // 连接到一个 SQLite 数据库文件
  const db = new sqlite3.Database('./my_database.db', (err) => {
    if (err) {
      console.error('打开数据库失败', err.message);
    } else {
      console.log('成功连接到数据库');
    }
  });

  // 创建一个表格
  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)'
    );

    // 插入数据
    const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
    stmt.run('John Doe');
    stmt.run('Jane Smith');
    stmt.finalize();

    // 查询数据
    db.each<{ id: string; name: string }>(
      'SELECT id, name FROM users',
      (err, row) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(`${row.id}: ${row.name}`);
        }
      }
    );
  });

  // 关闭数据库连接
  // db.close((err) => {
  //   if (err) {
  //     console.error('关闭数据库连接失败', err.message);
  //   } else {
  //     console.log('成功关闭数据库连接');
  //   }
  // });
}
