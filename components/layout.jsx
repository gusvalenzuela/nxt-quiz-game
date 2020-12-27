import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useCurrentUser } from '../lib/hooks'
import Footer from './Footer'

export default function Layout({ children }) {
  const [user, { mutate }] = useCurrentUser()
  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    })
    mutate(null)
  }
  return (
    <div id="myapp">
      <style jsx>
        {`
          #myapp {
            height: 100vh;
            width: 100vw;

            min-height: 600px;
            display: grid;
            grid-template-rows: auto 1fr auto;
            margin: 0;
            padding: 0;
          }
        `}
      </style>
      <Head>
        <title>QuizDown⁉</title>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="QuizDown⁉ is a fun timed quiz game on the web. "
        />
        <meta property="og:title" content="QuizDown⁉ App" />
        <meta
          property="og:description"
          content="QuizDown⁉ is a fun timed quiz game on the web. "
        />
        <meta
          property="og:image"
          content="https://repository-images.githubusercontent.com/201392697/5d392300-eef3-11e9-8e20-53310193fbfd"
        />
      </Head>
      <header>
        <nav>
          <Link href="/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <h1>QuizDown⁉</h1>
            </a>
          </Link>
          <div>
            {!user ? (
              <>
                <Link href="/login" passHref>
                  <button type="button">Sign in</button>
                </Link>
                <Link href="/signup" passHref>
                  <button type="button">Sign up</button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/user/[userId]" as={`/user/${user._id}`}>
                  <button type="button">Profile</button>
                </Link>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a tabIndex={0} role="button" onClick={handleLogout}>
                  Logout
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>{children}</main>
      <Footer />
    </div>
  )
}
