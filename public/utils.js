export testCollideLineCircle = (Ax,Ay,Bx,By,Cx,Cy,Cr){
	// compute the euclidean distance between A and B
	let DIST_AB = Math.sqrt( (Bx-Ax)*(Bx-Ax)+(By-Ay)*(By-Ay) );

	let DIST_CA = Math.sqrt( (Ax-Cx)*(Ax-Cx)+(Ay-Cy)*(Ay-Cy) );
	let DIST_CB = Math.sqrt( (Bx-Cx)*(Bx-Cx)+(By-Cy)*(By-Cy) );

	let DIST_MIN = Math.sqrt((DIST_AB/2)*(DIST_AB/2) + Cr*Cr)*2;

	DIST_CA += DIST_CB;

	return (DIST_CA <= DIST_MIN);
}

export testCollideCircleCircle = (Ax,Ay,Ar,Bx,By,Br){
	let DIST_AB = Math.sqrt( (Bx-Ax)*(Bx-Ax)+(By-Ay)*(By-Ay) );
	let DIST_R = Ar+Br;
	return (DIST_AB <= DIST_R);
}