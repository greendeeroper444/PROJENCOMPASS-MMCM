import React from 'react'
import ContentCommentDetail from '../components/ContentCommentDetail';

export default function CommentDetailPage() {
    
  return (
    <>
        <div className='container-fluid home--content'>
            <div className='row'>
                {/* content */}
                <div>
                        <div className='container'>
                            <div className='mt-5 row row--content'>
                                <div className='col mt-5'>
                                    <ContentCommentDetail />
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </>
  );
}
