import React, { useState } from 'react';
import ContentPostDetail from '../components/ContentPostDetail';

export default function PostDetailPage() {

  return (
    <>
        <div className='container-fluid home--content'>
            <div className='row'>

                {/* content */}
                <div>
                    <div className='container'>
                        <div className='mt-5 row row--content'>
                            <div className='col mt-5'>
                                <ContentPostDetail />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>
  );
}
